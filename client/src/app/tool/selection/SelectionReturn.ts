import { Point } from './Point';

export interface SelectionReturn {
  empty: boolean;
  selectedElements: Set<SVGElement>;
  points: [Point, Point];
}
