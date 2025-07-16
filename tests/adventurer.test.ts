import { Dir } from "fs";
import { Adventurer } from "../src/adventurer";
import { Direction, State } from "../src/enum";
import { TreasorCell } from "../src/interface";
import { TreasorMap } from "../src/treasormap";

describe("Adventurer Test Suite", () => {
  it.each([
    ["Indiana", "S", "AAG", Direction.SOUTH],
    ["Indiana", "N", "AAG", Direction.NORTH],
    ["Indiana", "E", "AAG", Direction.EAST],
    ["Indiana", "O", "AAG", Direction.WEST],
    ["Indiana", "X", "AAG", Direction.DEFAULT],
    ["Indiana", "", "AAG", Direction.DEFAULT],
  ])(
    "should %s have the right direction from input: %s with path: %s to expected direction: %s",
    (name, direction, path, expectedOrientation) => {
      const adventurer = new Adventurer(name, direction, path);
      expect(adventurer.direction).toBe(expectedOrientation);
      if (Object.values(Direction).includes(adventurer.direction)) {
        expect(adventurer.direction).toBeDefined();
      }
    }
  );

  it.each([
    ["Indiana", { x: 1, y: 1 }, "S", "A", { x: 1, y: 2 }, Direction.SOUTH],
    ["Indiana", { x: 1, y: 1 }, "S", "AA", { x: 1, y: 3 }, Direction.SOUTH],
    ["Indiana", { x: 1, y: 1 }, "S", "AAD", { x: 1, y: 3 }, Direction.WEST],
    ["Indiana", { x: 1, y: 1 }, "S", "AADA", { x: 0, y: 3 }, Direction.WEST],
    ["Indiana", { x: 1, y: 1 }, "S", "AADAD", { x: 0, y: 3 }, Direction.NORTH],
    ["Indiana", { x: 1, y: 1 }, "S", "D", { x: 1, y: 1 }, Direction.WEST],
    ["Indiana", { x: 1, y: 1 }, "S", "DA", { x: 0, y: 1 }, Direction.WEST],
    ["Indiana", { x: 1, y: 1 }, "S", "G", { x: 1, y: 1 }, Direction.EAST],
    ["Indiana", { x: 1, y: 1 }, "S", "GA", { x: 2, y: 1 }, Direction.EAST],
    ["Indiana", { x: 1, y: 1 }, "S", "AADADA", { x: 0, y: 2 }, Direction.NORTH],
  ])(
    "should %s startpos: %s dir: %s with path %s arrive at position %s",
    async (name, startPos, direction, path, endPos, expectedDir) => {
      const adventurer = new Adventurer(name, direction, path);
      const tm = new TreasorMap();
      await tm.parseInputFile("tests/test-adv1.txt");
      tm.init();
      tm.map[startPos.y][startPos.x].perso = adventurer;
      tm.map[startPos.y][startPos.x].perso!.move(tm.map, startPos);
      expect(tm.map[endPos.y][endPos.x].perso).toBeDefined();
      expect(tm.map[endPos.y][endPos.x].perso?.direction).toBe(expectedDir);
    }
  );
  it.each([["Indiana", { x: 1, y: 1 }, "S", "AADADA", { x: 0, y: 3 }]])(
    "should %s startpos: %s dir: %s with path %s arrive at position %s whith Mountain obstacle",
    async (name, startPos, direction, path, endPos) => {
      const adventurer = new Adventurer(name, direction, path);
      const tm = new TreasorMap();
      await tm.parseInputFile("tests/test-adv2.txt");
      tm.init();
      tm.map[startPos.y][startPos.x].perso = adventurer;
      tm.map[startPos.y][startPos.x].perso!.move(tm.map, startPos);
      expect(tm.map[endPos.y][endPos.x].perso).toBeDefined();
    }
  );

  it.each([
    ["Indiana", { x: 1, y: 1 }, "S", "AADADA", { x: 0, y: 3 }, 1, 1],
    ["Indiana", { x: 1, y: 1 }, "S", "AADADADAGA", { x: 1, y: 2 }, 2, 0],
  ])(
    "should %s startpos: %s dir: %s with path %s arrive at position %s with Mountain and Treasor",
    async (name, startPos, direction, path, endPos, expectedNbTreasor, nbTreasor) => {
      const adventurer = new Adventurer(name, direction, path);
      const tm = new TreasorMap();
      await tm.parseInputFile("tests/test-adv3.txt");
      tm.init();
      tm.map[startPos.y][startPos.x].perso = adventurer;
      tm.map[startPos.y][startPos.x].perso!.move(tm.map, startPos);
      const treasorCell = tm.map[2][1] as TreasorCell;
      expect(tm.map[endPos.y][endPos.x].perso).toBeDefined();
      expect(treasorCell.state).toEqual(State.TREASOR);
      expect(adventurer.items.get(State.TREASOR)).toBe(expectedNbTreasor);
      expect(treasorCell.nb).toBe(nbTreasor);
    }
  );

  it.each([["Lara", { x: 1, y: 1 }, "S", { x: 0, y: 3 }, 3]])(
    "should %s startpos: %s dir: %s must arrive at position %s with %s Treasors",
    async (name, startPos, direction, endPos, expectedNbTreasor) => {
      const tm = new TreasorMap();
      await tm.parseInputFile("tests/test-adv4.txt");
      tm.init();
      const lara = tm.map[startPos.y][startPos.x].perso;
      expect(lara).toBeDefined();
      expect(lara?.name).toBe(name);
      expect(lara?.direction).toBe(direction);

      tm.map[startPos.y][startPos.x].perso!.move(tm.map, startPos);

      expect(tm.map[endPos.y][endPos.x].perso).toBeDefined();
      expect(lara?.items.get(State.TREASOR)).toBe(expectedNbTreasor);
    }
  );
});
