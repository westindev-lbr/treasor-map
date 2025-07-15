import { Adventurer } from "./adventurer";
import { State } from "./enum";

export interface Row {
  key: string;
  x: number;
  y: number;
  nb?: number;
  name?: string;
  orientation?: string;
  path?: string;
}

export interface Cell {
  id: number;
  state: State;
  x: number;
  y: number;
  perso?: Adventurer;
}

export interface TreasorCell extends Cell {
  nb: number;
}
