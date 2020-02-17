import { Injectable } from '@angular/core';

import { Point } from '../shape/common/Point';
import { Dimension } from '../shape/common/Rectangle';

const MINIMALDISTANCE = 3;

@Injectable({
  providedIn: 'root'
})
export class MathService {
  constructor() {}

  distanceIsLessThan3Pixel(point1: Point, point2: Point): boolean {
    return (
      Math.abs(point1.x - point2.x) <= MINIMALDISTANCE &&
      Math.abs(point1.y - point2.y) <= MINIMALDISTANCE
    );
  }

  // returns a point that forms an angle
  // multiple of 45 degrees with the X axis.
  findAlignedSegmentPoint(mousePosition: Point, lastPoint: Point): Point {
    const deltaX = mousePosition.x - lastPoint.x;
    const deltaY = mousePosition.y - lastPoint.y;
    const angleAxeX = Math.atan(deltaY / deltaX);
    if (Math.abs(angleAxeX) < Math.PI / 8) {
      return { x: mousePosition.x, y: lastPoint.y };
    }
    if (Math.abs(angleAxeX) > (Math.PI * 3) / 8) {
      return { x: lastPoint.x, y: mousePosition.y };
    } else {
      if (deltaY * deltaX > 0) {
        return { x: mousePosition.x, y: lastPoint.y + deltaX };
      } else {
        return { x: mousePosition.x, y: lastPoint.y - deltaX };
      }
    }
  }

  getRectangleUpLeftCorner(initialPoint: Point, oppositePoint: Point): Point {
    const deltaX = oppositePoint.x - initialPoint.x;
    const deltaY = oppositePoint.y - initialPoint.y;
    if (deltaX > 0 && deltaY < 0) {
      return { x: initialPoint.x, y: initialPoint.y + deltaY };
    }
    if (deltaX < 0 && deltaY < 0) {
      return { x: initialPoint.x + deltaX, y: initialPoint.y + deltaY };
    }
    if (deltaX < 0 && deltaY > 0) {
      return { x: initialPoint.x + deltaX, y: initialPoint.y };
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
    return { x: deltaX + initialPoint.x, y: deltaY + initialPoint.y };
  }

  getPolynomeCornersFromRectangle(
    mouseDownPoint: Point,
    upLeftCorner: Point,
    dimension: Dimension,
    sides: number): Point [] {
    const minSide = Math.min(dimension.width, dimension.height);

    const initialPoint: Point = {x: 0, y: 0};
    let angle = 0;
    const sideLength = Math.PI * minSide / sides;
    const points: Point [] = []
    if (upLeftCorner.x < mouseDownPoint.x) {
      initialPoint.x = mouseDownPoint.x - minSide / 2 - sideLength / 2;
    } else {
      initialPoint.x = mouseDownPoint.x + minSide / 2 - sideLength / 2;
    }
    if (upLeftCorner.y === mouseDownPoint.y) {
      initialPoint.y = mouseDownPoint.y + minSide;
    } else {
      initialPoint.y = mouseDownPoint.y;
    }
    points.push(initialPoint)
    let i = 1;

    while (i < sides) {
    const lastPoint = {x: 0, y: 0};
    lastPoint.x = points[i - 1].x + sideLength * Math.cos(angle);
    lastPoint.y = points[i - 1].y - sideLength * Math.sin(angle);
    points.push({ x : lastPoint.x, y: lastPoint.y});
    angle += (Math.PI * 2) / sides;
    i += 1;
    }
    return points;
  }

  cornersAreInRectangle(upLeftCorner: Point,
                        dimension: Dimension, points: Point []): boolean {
    for (const point of points) {
      if (point.x > upLeftCorner.x+ dimension.width || point.x < upLeftCorner.x){
        return false;
      }
      if (point.y > upLeftCorner.y+ dimension.height || point.y < upLeftCorner.y){
        return false;
      }
    }
    return true;
    }
}
