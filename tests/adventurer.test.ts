import { Adventurer } from "../src/adventurer";
import { Direction, State } from "../src/enum";
import { TreasureMap } from "../src/treasuremap";

describe("Adventurer Test Suite", () => {
  it.each([
    ["Indiana", Direction.SOUTH, Direction.SOUTH, "AAG"],
    ["Indiana", Direction.NORTH, Direction.NORTH, "AAG"],
    ["Indiana", Direction.EAST, Direction.EAST, "AAG"],
    ["Indiana", Direction.WEST, Direction.WEST, "AAG"],
    ["Indiana", Direction.DEFAULT, Direction.DEFAULT, "AAG"],
  ])(
    "should correctly initialize direction for %s: input=%s → expected=%s",
    (name, direction, expectedOrientation, path) => {
      const adventurer = new Adventurer(name, direction, path, { x: 1, y: 1 });
      expect(adventurer.direction).toBe(expectedOrientation);
      if (Object.values(Direction).includes(adventurer.direction)) {
        expect(adventurer.direction).toBeDefined();
      }
    }
  );

  it.each([
    ["Indiana", { x: 1, y: 1 }, Direction.SOUTH, "A", { x: 1, y: 2 }, Direction.SOUTH],
    ["Indiana", { x: 1, y: 1 }, Direction.SOUTH, "AA", { x: 1, y: 3 }, Direction.SOUTH],
    ["Indiana", { x: 1, y: 1 }, Direction.SOUTH, "AAD", { x: 1, y: 3 }, Direction.WEST],
    ["Indiana", { x: 1, y: 1 }, Direction.SOUTH, "AADA", { x: 0, y: 3 }, Direction.WEST],
    ["Indiana", { x: 1, y: 1 }, Direction.SOUTH, "AADAD", { x: 0, y: 3 }, Direction.NORTH],
    ["Indiana", { x: 1, y: 1 }, Direction.SOUTH, "D", { x: 1, y: 1 }, Direction.WEST],
    ["Indiana", { x: 1, y: 1 }, Direction.SOUTH, "DA", { x: 0, y: 1 }, Direction.WEST],
    ["Indiana", { x: 1, y: 1 }, Direction.SOUTH, "G", { x: 1, y: 1 }, Direction.EAST],
    ["Indiana", { x: 1, y: 1 }, Direction.SOUTH, "GA", { x: 2, y: 1 }, Direction.EAST],
    ["Indiana", { x: 1, y: 1 }, Direction.SOUTH, "AADADA", { x: 0, y: 2 }, Direction.NORTH],
  ])(
    "should move %s from %j facing %s with path '%s' to position %j and face %s",
    async (name, startPos, direction, path, endPos, expectedDir) => {
      const adventurer = new Adventurer(name, direction, path, startPos);
      const tm = new TreasureMap();
      await tm.parseInputFile("tests/test-adv1.txt");
      tm.init();
      tm.map[startPos.y][startPos.x].perso = adventurer;
      tm.map[startPos.y][startPos.x].perso!.move(tm.map);
      expect(tm.map[endPos.y][endPos.x].perso).toBeDefined();
      expect(tm.map[endPos.y][endPos.x].perso?.direction).toBe(expectedDir);
    }
  );
  it.each([["Indiana", { x: 1, y: 1 }, "AADADA", Direction.SOUTH, { x: 0, y: 3 }]])(
    "should stop %s at %j with path '%s' facing %s when blocked by mountains and end at %j",
    async (name, startPos, path, direction, endPos) => {
      const adventurer = new Adventurer(name, direction, path, startPos);
      const tm = new TreasureMap();
      await tm.parseInputFile("tests/test-adv2.txt");
      tm.init();
      tm.map[startPos.y][startPos.x].perso = adventurer;
      tm.map[startPos.y][startPos.x].perso!.move(tm.map);
      expect(tm.map[endPos.y][endPos.x].perso).toBeDefined();
    }
  );

  it.each([
    ["Indiana", { x: 1, y: 1 }, Direction.SOUTH, "AADADA", { x: 0, y: 3 }, 1, 1],
    ["Indiana", { x: 1, y: 1 }, Direction.SOUTH, "AADADADAGA", { x: 1, y: 2 }, 2, 0],
  ])(
    "should collect treasures: %s moves from %j and facing %s with path '%s' and ends at %j with %d collected, %d remaining",
    async (name, startPos, direction, path, endPos, expectedNbTreasor, nbTreasor) => {
      const adventurer = new Adventurer(name, direction, path, startPos);
      const tm = new TreasureMap();
      await tm.parseInputFile("tests/test-adv3.txt");
      tm.init();
      tm.map[startPos.y][startPos.x].perso = adventurer;
      tm.map[startPos.y][startPos.x].perso!.move(tm.map);
      const treasorCell = tm.map[2][1];
      expect(tm.map[endPos.y][endPos.x].perso).toBeDefined();
      expect(treasorCell.state).toEqual(State.TREASURE);
      expect(adventurer.items.get(State.TREASURE)).toBe(expectedNbTreasor);
      expect(treasorCell.nb).toBe(nbTreasor);
    }
  );

  it.each([["Lara", { x: 1, y: 1 }, Direction.SOUTH, { x: 0, y: 3 }, 3]])(
    "should let %s start at %j facing %s and collect %d treasures at %j",
    async (name, startPos, direction, endPos, expectedNbTreasor) => {
      const tm = new TreasureMap();
      await tm.parseInputFile("tests/test-adv4.txt");
      tm.init();
      const lara = tm.map[startPos.y][startPos.x].perso;
      expect(lara).toBeDefined();
      expect(lara?.name).toBe(name);
      expect(lara?.direction).toBe(direction);

      tm.map[startPos.y][startPos.x].perso!.move(tm.map);

      expect(tm.map[endPos.y][endPos.x].perso).toBeDefined();
      expect(lara?.items.get(State.TREASURE)).toBe(expectedNbTreasor);
    }
  );
});
