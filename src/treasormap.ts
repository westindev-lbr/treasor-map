import { Adventurer } from "./adventurer";
import { DELIMITER_PATTERN } from "./constants";
import { State } from "./enum";
import { Row, Cell } from "./interface";
import * as fs from "fs/promises";

export class TreasureMap {
  map: Array<Cell[]> = [];
  width: number = 0;
  height: number = 0;
  pieces: Row[] = [];
  adventurers: Adventurer[] = [];

  async parseInputFile(path: string): Promise<void> {
    try {
      const buffer = await fs.readFile(path);
      const lines: string[] = buffer.toString().split("\n") || [];
      this.pieces = this.parseConfig(lines);
    } catch (error) {
      console.error(`Failed to read file at path ${path}:`, error);
    }
  }

  init(): void {
    const map = this.pieces.find((r) => r.key === State.CARD);
    if (!map) throw new Error("Map configuration not found");

    this.width = map.x;
    this.height = map.y;

    if (this.width <= 0 || this.height <= 0) {
      throw new Error(`Invalid map size: ${this.height} x ${this.width}`);
    }
    this.map = new Array<Cell[]>(this.height);

    for (let i = 0; i < this.height; i++) {
      this.map[i] = new Array<Cell>(this.width);
      for (let j = 0; j < this.width; j++) {
        this.map[i][j] = { id: i * this.width + j, state: State.PLAIN, x: j, y: i };
      }
    }

    this.setElementsOnTheMap();
  }

  run(): void {
    const config = this.pieces.find((v) => v.key === State.ADVENTURER);
    if (!config) return;
    const { x, y } = config;
    const adv = this.map[y][x].perso;
    if (!adv) return;
    adv.move(this.map);
  }

  async generateFile(path: string): Promise<void> {
    const rows = this.parseMap();
    let format: string[] = [];
    rows
      .filter((v) => v.key !== State.PLAIN)
      .forEach((v) => {
        switch (v.key) {
          case "C":
            format.push(`${v.key} - ${v.x} - ${v.y}`);
            break;
          case "M":
            format.push(`\n${v.key} - ${v.x} - ${v.y}`);
            break;
          case "T":
            format.push(`\n# {T comme Trésor} - {Axe horizontal} - {Axe vertical} - {Nb. de trésors restants}`);
            format.push(`\n${v.key} - ${v.x} - ${v.y} - ${v.nb}`);
            break;
          case "A":
            format.push(
              `\n# {A comme Aventurier} - {Nom de l’aventurier} - {Axe horizontal} - {Axe vertical} - {Orientation} - {Nb. trésors ramassés}`
            );
            format.push(`\n${v.key} - ${v.name} - ${v.x} - ${v.y} - ${v.orientation} - ${v.nb}`);
            break;
          default:
            break;
        }
      });
    await fs.writeFile(path, format.join(""), "utf-8");
  }

  private parseConfig(lines: string[]): Row[] {
    return lines
      .map((l) => l.match(DELIMITER_PATTERN))
      .filter((tokens): tokens is RegExpMatchArray => tokens !== null)
      .map((tokens) => this.parseRow(tokens));
  }

  private setElementsOnTheMap(): void {
    this.pieces.forEach((row) => {
      const { x, y } = row;
      if (row.key === State.MOUNTAIN) {
        this.map[y][x].state = State.MOUNTAIN;
      } else if (row.key === State.TREASURE) {
        const cell = this.map[y][x];
        cell.state = State.TREASURE;
        cell.nb = row.nb ?? 0;
      } else if (row.key === State.ADVENTURER && row.name && row.orientation && row.path) {
        const adventurer = new Adventurer(row.name, row.orientation, row.path, { x, y });
        this.map[y][x].perso = adventurer;
        this.adventurers.push(adventurer);
      }
    });
  }

  private parseRow(tokens: string[]): Row {
    const [key, ...rest] = tokens;
    switch (key) {
      case "C":
        return { key, x: Number(rest[0]), y: Number(rest[1]) };
      case "M":
        return { key, x: Number(rest[0]), y: Number(rest[1]) };
      case "T":
        return { key, x: Number(rest[0]), y: Number(rest[1]), nb: Number(rest[2]) };
      case "A":
        return { key, name: rest[0], x: Number(rest[1]), y: Number(rest[2]), orientation: rest[3], path: rest[4] };
      default:
        throw new Error(`Invalid Row type : ${key}`);
    }
  }

  private parseMap(): Row[] {
    let rows: Row[] = [];
    rows = [...[{ key: State.CARD, x: this.width, y: this.height }]];
    this.map.map((cells) => {
      cells.map((cell) => {
        switch (cell.state) {
          case "M":
            rows.push({ key: cell.state, x: cell.x, y: cell.y });
            break;
          case "T":
            if (cell.nb) {
              rows.push({ key: cell.state, x: cell.x, y: cell.y, nb: cell.nb });
            }
            break;
        }
      });
    });
    this.adventurers.forEach((a) => {
      rows.push({
        key: State.ADVENTURER,
        name: a.name,
        x: a.position.x,
        y: a.position.y,
        orientation: a.direction,
        nb: a.items.get(State.TREASURE),
      });
    });
    return rows;
  }
}
