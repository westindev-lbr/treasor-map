import { Adventurer } from "./adventurer";
import { DELIMITER_PATTERN } from "./constants";
import { State } from "./enum";
import { Row, Cell, TreasorCell } from "./interface";
import * as fs from "fs/promises";

export class TreasorMap {
  config: Row[] = [];
  width: number = 0;
  height: number = 0;
  map: Array<Cell[]> = [];

  init(): void {
    const map = this.config.find((v) => v.key === "C");
    if (map) {
      this.width = map.x;
      this.height = map.y;
    }
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
    this.#setElementOnTheMap();
  }

  async parseInputFile(path: string): Promise<void> {
    try {
      const buffer = await fs.readFile(path);
      const tab: string[] = buffer.toString().split("\n") || [];
      const input = tab.map((l) => l.match(DELIMITER_PATTERN));
      for (let i = 0; i < input.length; i++) {
        const key = input[i]![0];
        if (input[i] && input[i]!.length >= 2) {
          switch (key) {
            case "C":
              const { cx, cy } = { cx: Number(input[i]![1]), cy: Number(input[i]![2]) };
              this.config.push({ key, x: cx, y: cy });
              break;
            case "M":
              const { mx, my } = { mx: Number(input[i]![1]), my: Number(input[i]![2]) };
              this.config.push({ key, x: mx, y: my });
              break;
            case "T":
              if (input[i] && input[i]!.length >= 3) {
                const { tx, ty, nb } = { tx: Number(input[i]![1]), ty: Number(input[i]![2]), nb: Number(input[i]![3]) };
                this.config.push({ key, x: tx, y: ty, nb });
              }
              break;
            case "A":
              if (input[i] && input[i]!.length >= 6) {
                const { name, ax, ay, orientation, path } = {
                  name: input[i]![1],
                  ax: Number(input[i]![2]),
                  ay: Number(input[i]![3]),
                  orientation: input[i]![4],
                  path: input[i]![5],
                };
                this.config.push({ key, x: ax, y: ay, name, orientation, path });
              }
              break;
            default:
              break;
          }
        } else {
          console.warn(`invalid input ${input[i]}`);
        }
      }
    } catch (error) {
      console.error(`Failed to read file at path ${path}:`, error);
      this.map = [];
    }
  }

  #setElementOnTheMap(): void {
    this.config
      .filter((r) => r.key === "M")
      .forEach((c) => {
        this.map[c.y][c.x].state = State.MOUNTAIN;
      });
    this.config
      .filter((r) => r.key === "T")
      .forEach((c) => {
        (this.map[c.y][c.x] as TreasorCell).state = State.TREASOR;
        (this.map[c.y][c.x] as TreasorCell).nb = c.nb ?? 0;
      });
    this.config
      .filter((r) => r.key === "A")
      .forEach((c) => {
        if (c.name && c.orientation && c.path) this.map[c.y][c.x].perso = new Adventurer(c.name, c.orientation, c.path);
      });
  }
}
