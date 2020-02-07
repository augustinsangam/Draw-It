import { Injectable } from '@angular/core';
import { Point } from '../tool-common classes/Point'
import { ToolService } from '../tool.service';
import { Dimension } from './rectangle-logic/Dimension'

@Injectable({
  providedIn: 'root'
})
export class RectangleService extends ToolService {

  fillOption = true;
  borderOption = true;
  thickness = 2;

  constructor() {
    super();
  }
  getRectangleUpLeftCorner(initialPoint: Point, oppositePoint: Point): Point {
    const deltaX = oppositePoint.x - initialPoint.x;
    const deltaY = oppositePoint.y - initialPoint.y;
    if (deltaX > 0 && deltaY < 0) {
      return {x: initialPoint.x, y: initialPoint.y + deltaY};
    }
    if (deltaX < 0 && deltaY < 0) {
      return {x: initialPoint.x + deltaX, y: initialPoint.y + deltaY};
    }
    if (deltaX < 0 && deltaY > 0) {
      return {x: initialPoint.x + deltaX, y: initialPoint.y};
    } else {
      return initialPoint;
    }
  }
  getRectangleSize(initialPoint: Point, oppositePoint: Point): Dimension {
    const x = Math.abs(oppositePoint.x - initialPoint.x);
    const y = Math.abs(oppositePoint.y - initialPoint.y);
    return { height: y, width: x };
  }
  // transform a rectangle to a square
  // return the point diagonally opposite to the initial point
  transformRectangleToSquare(initialPoint: Point, oppositePoint: Point): Point {
    let deltaX = oppositePoint.x - initialPoint.x;
    let deltaY = oppositePoint.y - initialPoint.y;
    const min = Math.min(Math.abs(deltaY), Math.abs(deltaX));
    if (min === Math.abs(deltaY)) {
      deltaX = Math.sign(deltaX) * min;
    } else {
      deltaY = Math.sign(deltaY) * min;
    }
    return {x: deltaX + initialPoint.x, y: deltaY + initialPoint.y}
  }
}
