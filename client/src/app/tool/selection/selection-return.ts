import { Point } from './point';

export interface SelectionReturn {
  empty: boolean;
  selectedElements: Set<SVGElement>;
  points: [Point, Point];
}
