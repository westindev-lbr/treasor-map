import { Direction, State } from "./enum";
import { display2DArray } from "./helper";
import { Cell } from "./interface";

export class Adventurer {
  name: string;
  direction: Direction;
  path: string;

  constructor(name: string, direction: string, path: string) {
    this.name = name;
    this.direction = Object.values(Direction).includes(direction as Direction)
      ? (direction as Direction)
      : Direction.DEFAULT;
    this.path = path;
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
          map[y][x].perso = undefined;
          startPos.y--;
          map[startPos.y][x].perso = this;
        }
        break;
      case Direction.SOUTH:
        if (y < map.length - 1 && map[y + 1][x].state !== State.MOUNTAIN) {
          map[y][x].perso = undefined;
          startPos.y++;
          map[startPos.y][x].perso = this;
        }
        break;
      case Direction.EAST:
        if (x < map[0].length - 1 && map[y][x + 1].state !== State.MOUNTAIN) {
          map[y][x].perso = undefined;
          startPos.x++;
          map[y][startPos.x].perso = this;
        }
        break;
      case Direction.WEST:
        if (x > 0 && map[y][x - 1].state !== State.MOUNTAIN) {
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
}
