import { Point } from '../Point';
import { ElementSelectedType } from './ElementSelectedType';

export interface MouseTracking {
  startPoint: Point;
  currentPoint: Point;
  endPoint: Point;
  mouseIsDown: boolean;
  selectedElement: ElementSelectedType
}
