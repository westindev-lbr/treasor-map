import { Cell } from "./interface";

export const display2DArray = (array: Array<Cell[]>) => {
  const table = array.map((row) =>
    row.map((cell) => `(${cell.x},${cell.y}) - ${cell.state} - ${cell.perso?.name ?? "x"} - ${cell.perso?.direction}`)
  );
  console.table(table);
};
