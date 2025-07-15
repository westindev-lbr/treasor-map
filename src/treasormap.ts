import { Adventurer } from "./adventurer";
import { DELIMITER_PATTERN } from "./constants";
import { State } from "./enum";
import { Row, Cell, TreasorCell } from "./interface";
import * as fs from "fs/promises";

export class TreasorMap {
  map: Array<Cell[]> = [];
  width: number = 0;
  height: number = 0;
  pieces: Row[] = [];

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
    const map = this.pieces.find((r) => r.key === "C");
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

  private parseConfig(lines: string[]): Row[] {
    return lines
      .map((l) => l.match(DELIMITER_PATTERN))
      .filter((tokens): tokens is RegExpMatchArray => tokens !== null)
      .map((tokens) => this.parseRow(tokens));
  }

  private setElementsOnTheMap(): void {
    this.pieces.forEach((row) => {
      const { x, y } = row;
      if (row.key === "M") {
        this.map[y][x].state = State.MOUNTAIN;
      } else if (row.key === "T") {
        const cell = this.map[y][x] as TreasorCell;
        cell.state = State.TREASOR;
        cell.nb = row.nb ?? 0;
      } else if (row.key === "A" && row.name && row.orientation && row.path) {
        this.map[y][x].perso = new Adventurer(row.name, row.orientation, row.path);
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
}
