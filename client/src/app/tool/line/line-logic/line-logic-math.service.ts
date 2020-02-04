import { Injectable } from '@angular/core';
import {Point} from '../../tool-common classes/Point'

const MINDIST = 3;
@Injectable({
  providedIn: 'root'
})
export class LineLogicMathService {
  constructor() { }
  distanceIsLessThan3Pixel(point1: Point, point2: Point): boolean {
    return ((Math.abs(point1.x - point2.x) <= MINDIST) && (Math.abs(point1.y - point2.y) <= MINDIST));
  }
  findAlignedSegmentPoint(mousePosition: Point, lastPoint: Point): Point {
    const deltaX = mousePosition.x - lastPoint.x
    const deltaY = mousePosition.y - lastPoint.y
    const angleAxeX = Math.atan(deltaY / deltaX)
    if (Math.abs(angleAxeX) < Math.PI / 8) {
      return new Point(mousePosition.x, lastPoint.y)
    }
    if (Math.abs(angleAxeX) > Math.PI * 3 / 8) {
      return new Point(lastPoint.x, mousePosition.y)
    } else {
      if (deltaY * deltaX > 0) {
        return new Point(mousePosition.x, lastPoint.y + deltaX)
      } else {
        return new Point(mousePosition.x, lastPoint.y - deltaX)
      }
    }
  }
}
