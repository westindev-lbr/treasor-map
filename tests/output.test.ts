import * as fs from "fs/promises";
import { TreasureMap } from "../src/treasormap";

describe("Output Test Suite", () => {
  it("should return an output format in file", async () => {
    const expectedOutput = (await fs.readFile("tests/test-expected-output.txt")).toString();

    const tm = new TreasureMap();
    await tm.parseInputFile("tests/test-input.txt");
    tm.init();
    tm.run();
    await tm.generateFile("tests/output.txt");

    const result = (await fs.readFile("tests/output.txt")).toString();

    expect(result).toBe(expectedOutput);
  });
});
