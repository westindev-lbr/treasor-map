import { INPUT_FILE, OUTPUT_FILE } from "./constants";
import { TreasureMap } from "./treasormap";

async function main() {
  const tm = new TreasureMap();
  await tm.parseInputFile(INPUT_FILE);
  tm.init();
  tm.run();
  await tm.generateFile(OUTPUT_FILE);
}

main().catch(console.error);
