import { Direction, State } from "./enum";
import { Cell, TreasorCell } from "./interface";

export class Adventurer {
  name: string;
  direction: Direction;
  path: string;
  items: Map<string, number>;

  constructor(name: string, direction: string, path: string) {
    this.name = name;
    this.direction = Object.values(Direction).includes(direction as Direction)
      ? (direction as Direction)
      : Direction.DEFAULT;
    this.path = path;
    this.items = new Map<string, number>([["T", 0]]);
  }

  move(map: Array<Cell[]>, startPos: { x: number; y: number }) {
    for (let move of this.path) {
      switch (move) {
        case "A":
          this.advance(map, startPos);
          break;
        case "G":
          this.turnLeft();
          break;
        case "D":
          this.turnRight();
          break;
        default:
          console.warn(`Invalid move: ${move}`);
      }
    }
  }

  private advance(map: Array<Cell[]>, startPos: { x: number; y: number }): void {
    const { x, y } = startPos;
    switch (this.direction) {
      case Direction.NORTH:
        if (y > 0 && map[y - 1][x].state !== State.MOUNTAIN) {
          const ncell = map[y - 1][x];
          if (this.hasTreasor(ncell)) {
            const treasor = ncell as TreasorCell;
            treasor.nb--;
            this.addItem(State.TREASOR, 1);
          }
          map[y][x].perso = undefined;
          startPos.y--;
          map[startPos.y][x].perso = this;
        }
        break;
      case Direction.SOUTH:
        if (y < map.length - 1 && map[y + 1][x].state !== State.MOUNTAIN) {
          const scell = map[y + 1][x];
          if (this.hasTreasor(scell)) {
            const treasor = scell as TreasorCell;
            treasor.nb--;
            this.addItem(State.TREASOR, 1);
          }
          map[y][x].perso = undefined;
          startPos.y++;
          map[startPos.y][x].perso = this;
        }
        break;
      case Direction.EAST:
        if (x < map[0].length - 1 && map[y][x + 1].state !== State.MOUNTAIN) {
          const ecell = map[y][x + 1];
          if (this.hasTreasor(ecell)) {
            const treasor = ecell as TreasorCell;
            treasor.nb--;
            this.addItem(State.TREASOR, 1);
          }
          map[y][x].perso = undefined;
          startPos.x++;
          map[y][startPos.x].perso = this;
        }
        break;
      case Direction.WEST:
        if (x > 0 && map[y][x - 1].state !== State.MOUNTAIN) {
          const wcell = map[y][x - 1];
          if (this.hasTreasor(wcell)) {
            const treasor = wcell as TreasorCell;
            treasor.nb--;
            this.addItem(State.TREASOR, 1);
          }
          map[y][x].perso = undefined;
          startPos.x--;
          map[y][startPos.x].perso = this;
        }
        break;
    }
  }

  private turnLeft(): void {
    switch (this.direction) {
      case Direction.NORTH:
        this.direction = Direction.WEST;
        break;
      case Direction.SOUTH:
        this.direction = Direction.EAST;
        break;
      case Direction.EAST:
        this.direction = Direction.NORTH;
        break;
      case Direction.WEST:
        this.direction = Direction.SOUTH;
        break;
    }
  }

  private turnRight(): void {
    switch (this.direction) {
      case Direction.NORTH:
        this.direction = Direction.EAST;
        break;
      case Direction.SOUTH:
        this.direction = Direction.WEST;
        break;
      case Direction.EAST:
        this.direction = Direction.SOUTH;
        break;
      case Direction.WEST:
        this.direction = Direction.NORTH;
        break;
    }
  }

  private addItem(type: State, nb: number): void {
    const nbItem: number = this.items.get(type) || 0;
    this.items.set(type, nbItem + nb);
  }

  private hasTreasor(cell: Cell): boolean {
    return cell.state === State.TREASOR && (cell as TreasorCell).nb > 0;
  }
}
