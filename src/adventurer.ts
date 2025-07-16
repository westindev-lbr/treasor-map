import { FORWARD, LEFT, RIGHT } from "./constants";
import { Direction, State } from "./enum";
import { Cell } from "./interface";

export class Adventurer {
  name: string;
  direction: Direction;
  path: string;
  items: Map<string, number>;
  position: { x: number; y: number };

  constructor(name: string, direction: Direction, path: string, startPos: { x: number; y: number }) {
    this.name = name;
    this.direction = direction;
    this.path = path;
    this.items = new Map<string, number>([[State.TREASURE, 0]]);
    this.position = startPos;
  }

  move(map: Array<Cell[]>) {
    for (let move of this.path) {
      switch (move) {
        case FORWARD:
          this.forward(map);
          break;
        case LEFT:
          this.turnLeft();
          break;
        case RIGHT:
          this.turnRight();
          break;
        default:
          console.warn(`Invalid move: ${move} for ${this.name}`);
      }
    }
  }

  private forward(map: Array<Cell[]>): void {
    const { x, y } = this.position;
    switch (this.direction) {
      case Direction.NORTH:
        if (y > 0 && map[y - 1][x].state !== State.MOUNTAIN) {
          const ncell = map[y - 1][x];
          if (ncell.nb && this.hasTreasure(ncell)) {
            ncell.nb--;
            this.addItem(State.TREASURE, 1);
          }
          map[y][x].perso = undefined;
          this.position.y--;
          map[this.position.y][x].perso = this;
        }
        break;
      case Direction.SOUTH:
        if (y < map.length - 1 && map[y + 1][x].state !== State.MOUNTAIN) {
          const scell = map[y + 1][x];
          if (scell.nb && this.hasTreasure(scell)) {
            scell.nb--;
            this.addItem(State.TREASURE, 1);
          }
          map[y][x].perso = undefined;
          this.position.y++;
          map[this.position.y][x].perso = this;
        }
        break;
      case Direction.EAST:
        if (x < map[0].length - 1 && map[y][x + 1].state !== State.MOUNTAIN) {
          const ecell = map[y][x + 1];
          if (ecell.nb && this.hasTreasure(ecell)) {
            ecell.nb--;
            this.addItem(State.TREASURE, 1);
          }
          map[y][x].perso = undefined;
          this.position.x++;
          map[y][this.position.x].perso = this;
        }
        break;
      case Direction.WEST:
        if (x > 0 && map[y][x - 1].state !== State.MOUNTAIN) {
          const wcell = map[y][x - 1];
          if (wcell.nb && this.hasTreasure(wcell)) {
            wcell.nb--;
            this.addItem(State.TREASURE, 1);
          }
          map[y][x].perso = undefined;
          this.position.x--;
          map[y][this.position.x].perso = this;
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

  private hasTreasure(cell: Cell): boolean {
    return cell.state === State.TREASURE && cell.nb! > 0;
  }
}
