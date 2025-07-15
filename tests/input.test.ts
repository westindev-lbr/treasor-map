import { Adventurer } from "../src/adventurer";
import { State } from "../src/enum";
import { Row, TreasorCell } from "../src/interface";
import { TreasorMap } from "../src/treasormap";

describe("Read Input file", () => {
  const tm = new TreasorMap();

  beforeAll(async () => {
    await tm.parseInputFile("tests/test.txt");
    tm.init();
  });

  it("should return a Configuration of MAP from C - 3 - 4 in input ( array[4][3] ) ", async () => {
    expect(tm.map).toBeDefined();
    expect(tm.map!.length).toBe(4);
  });

  it("should be a cell of PLAIN at initialisation", async () => {
    expect(tm.map![0][0].state).toBe(State.PLAIN);
  });

  it("should have an id number following arithmetic index", () => {
    expect(tm.map![0][0].id).toBe(0);
    expect(tm.map![0][1].id).toBe(1);
    expect(tm.map![0][2].id).toBe(2);
    expect(tm.map![3][0].id).toBe(9);
    expect(tm.map![3][2].id).toBe(11);
  });

  it("should have MOUNTAIN cells", () => {
    expect(tm.config).toBeTruthy();
    expect(tm.config).toEqual(expect.arrayContaining([{ key: "M", x: 1, y: 1 } as Row]));
  });

  it("should the map has a MOUNTAIN in pos(1,1) and pos(2,2)", () => {
    expect(tm.map[1][1].state).toBe(State.MOUNTAIN);
    expect(tm.map[2][2].state).toBe(State.MOUNTAIN);
  });

  it("should have TREASOR cells", () => {
    expect(tm.config).toBeTruthy();
    expect(tm.config).toEqual(expect.arrayContaining([{ key: "T", x: 0, y: 3, nb: 2 } as Row]));
  });
  it("should the map has a TREASOR in pos(0,3) and nb : 2", () => {
    expect(tm.map[3][0].state).toBe(State.TREASOR);
    expect((tm.map[3][0] as TreasorCell).nb).toBe(2);
  });
  it("should the map has a TREASOR in pos(1,3) and nb : 1", () => {
    expect(tm.map[3][1].state).toBe(State.TREASOR);
    expect((tm.map[3][1] as TreasorCell).nb).toBe(1);
  });
  it("should have an ADVENTURE", () => {
    expect(tm.config).toBeTruthy();
    expect(tm.config).toEqual(
      expect.arrayContaining([{ key: "A", name: "Indiana", x: 1, y: 1, orientation: "S", path: "AADADA" } as Row])
    );
  });
  it("should the map has an ADVENTURER in pos(1,1)", () => {
    expect(tm.map[1][1].state).toBe(State.MOUNTAIN);
    expect(tm.map[1][1].perso).toBeInstanceOf(Adventurer);
  });
});
