import { Point } from './Point';

export interface SelectionReturn {
  empty: boolean;
  selectedElements: SVGElement[];
  points: [Point, Point];
}
