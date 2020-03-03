import { Point } from '../shape/common/point';

export interface SelectionReturn {
  empty: boolean;
  selectedElements: Set<SVGElement>;
  points: [Point, Point];
}
