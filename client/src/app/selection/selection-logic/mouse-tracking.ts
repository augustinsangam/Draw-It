import { Point } from '../../tool/shape/common/point';
import { ElementSelectedType } from './element-selected-type';

export interface MouseTracking {
  startPoint: Point;
  currentPoint: Point;
  endPoint: Point;
  mouseIsDown: boolean;
  selectedElement: ElementSelectedType;
  onDrag: boolean;
  onResize: boolean;
}
