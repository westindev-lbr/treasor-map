import { Adventurer } from "../src/adventurer";
import { State } from "../src/enum";
import { Row } from "../src/interface";
import { TreasureMap } from "../src/treasuremap";

describe("TreasureMap: parsing and initialization from input file", () => {
  const tm = new TreasureMap();

  beforeAll(async () => {
    await tm.parseInputFile("tests/test.txt");
    tm.init();
  });

  it("should initialize a 4x3 map from 'C - 3 - 4' input", async () => {
    expect(tm.map).toBeDefined();
    expect(tm.map!.length).toBe(4);
  });

  it("should initialize all cells as PLAIN by default", async () => {
    expect(tm.map![0][0].state).toBe(State.PLAIN);
  });

  it("should assign correct arithmetic ID to each cell", () => {
    expect(tm.map![0][0].id).toBe(0);
    expect(tm.map![0][1].id).toBe(1);
    expect(tm.map![0][2].id).toBe(2);
    expect(tm.map![3][0].id).toBe(9);
    expect(tm.map![3][2].id).toBe(11);
  });

  it("should include MOUNTAIN cells in parsed pieces", () => {
    expect(tm.pieces).toBeTruthy();
    expect(tm.pieces).toEqual(expect.arrayContaining([{ key: State.MOUNTAIN, x: 1, y: 1 } as Row]));
  });

  it("should place MOUNTAIN cells at positions (1,1) and (2,2)", () => {
    expect(tm.map[1][1].state).toBe(State.MOUNTAIN);
    expect(tm.map[2][2].state).toBe(State.MOUNTAIN);
  });

  it("should include TREASURE cells in parsed pieces", () => {
    expect(tm.pieces).toBeTruthy();
    expect(tm.pieces).toEqual(expect.arrayContaining([{ key: State.TREASURE, x: 0, y: 3, nb: 2 } as Row]));
  });
  it("should place a TREASURE at (0,3) with 2 treasures", () => {
    expect(tm.map[3][0].state).toBe(State.TREASURE);
    expect(tm.map[3][0].nb).toBe(2);
  });
  it("should place a TREASURE at (1,3) with 1 treasure", () => {
    expect(tm.map[3][1].state).toBe(State.TREASURE);
    expect(tm.map[3][1].nb).toBe(1);
  });
  it("should include an ADVENTURER in parsed pieces", () => {
    expect(tm.pieces).toBeTruthy();
    expect(tm.pieces).toEqual(
      expect.arrayContaining([{ key: "A", name: "Indiana", x: 1, y: 1, orientation: "S", path: "AADADA" } as Row])
    );
  });
  it("should place an ADVENTURER at (1,1)", () => {
    expect(tm.map[1][1].state).toBe(State.MOUNTAIN);
    expect(tm.map[1][1].perso).toBeInstanceOf(Adventurer);
  });
});
