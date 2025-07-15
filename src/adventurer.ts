import { Direction, State } from "./enum";
import { display2DArray } from "./helper";
import { Cell } from "./interface";

export class Adventurer {
  name: string;
  direction: Direction;
  path: string[];

  constructor(name: string, direction: string, path: string) {
    this.name = name;
    this.direction = Object.values(Direction).includes(direction as Direction)
      ? (direction as Direction)
      : Direction.DEFAULT;
    this.path = path.split("");
  }

  move(map: Array<Cell[]>, startPos: { x: number; y: number }) {
    for (let move of this.path) {
      if (JSON.stringify(this.path) === JSON.stringify(["A", "A", "D", "A", "D", "A"])) {
        console.log(this.path, move, this.direction, `(${startPos.x},${startPos.y})`);
        display2DArray(map);
      }
      switch (move) {
        case "A":
          switch (this.direction) {
            case Direction.NORTH:
              if (startPos.y > 0 && map[startPos.y - 1][startPos.x].state !== State.MOUNTAIN) {
                map[startPos.y][startPos.x].perso = undefined;
                startPos.y--;
                map[startPos.y][startPos.x].perso = this;
              }
              break;
            case Direction.SOUTH:
              if (startPos.y < map.length - 1 && map[startPos.y + 1][startPos.x].state !== State.MOUNTAIN) {
                map[startPos.y][startPos.x].perso = undefined;
                startPos.y++;
                map[startPos.y][startPos.x].perso = this;
              }
              break;
            case Direction.EAST:
              if (startPos.x < map[0].length - 1 && map[startPos.y][startPos.x + 1].state !== State.MOUNTAIN) {
                map[startPos.y][startPos.x].perso = undefined;
                startPos.x++;
                map[startPos.y][startPos.x].perso = this;
              }
              break;
            case Direction.WEST:
              if (startPos.x > 0 && map[startPos.y][startPos.x - 1].state !== State.MOUNTAIN) {
                map[startPos.y][startPos.x].perso = undefined;
                startPos.x--;
                map[startPos.y][startPos.x].perso = this;
                break;
              }
            default:
              break;
          }
          break;
        case "G":
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
            default:
              break;
          }
          break;
        case "D":
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
            default:
              break;
          }
          break;
        default:
          break;
      }
    }
  }
}
