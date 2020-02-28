import { Injectable } from '@angular/core';

import { Point } from '../selection/Point';
import { Radius } from '../shape/common/Ellipse';
import { Dimension } from '../shape/common/Rectangle';

const MINIMALDISTANCE = 3;
const MULTIPLICATEURX: number [] =
  [0, 0, 1.15, 1.415, 1.05, 1.00, 1.015, 1.08, 1.01, 1.0, 1.01, 1.03];
const MULTIPLICATEURY: number [] =
  [0, 0, 1.32, 1.415, 1.1, 1.155, 1.05, 1.08, 1.027, 1.05, 1.02, 1.03];
const DECALAGEX: number [] =
  [0, 0, 1.15, 1.0, 1.045, 1.15, 1.025, 1.0, 1.0, 1.06, 1.02, 1.0];
const DECALAGEY: number [] =
  [0, 0, 1.0, 1.0, 0.97, 0.88, 1.0, 1.0, 1.0, 0.95, 1.0, 1.0];
const RATIOTRANSITION: number[] =
  [0, 0, 1.15, 1.0, 1.04, 1.15, 1.08, 1.0, 1.04, 1.06, 1.08, 1.0];
const FACTEURTRANSITION: number[] =
  [0, 0, 1.0, 1.0, 1.01, 1.0, 1.02, 1.0, 1.0, 1.0, 1.0, 1.0];

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
      return new Point(mousePosition.x, lastPoint.y);
    }
    if (Math.abs(angleAxeX) > (Math.PI * 3) / 8) {
      return new Point(lastPoint.x, mousePosition.y);
    }
    if (deltaY * deltaX > 0) {
      return new Point(mousePosition.x, lastPoint.y + deltaX);
    }
    return new Point(mousePosition.x, lastPoint.y - deltaX);
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
    return new Point(deltaX + initialPoint.x, deltaY + initialPoint.y);
  }

  getPolynomeCornersFromRectangle(
    mouseDownPoint: Point,
    upLeftCorner: Point,
    dimension: Dimension,
    sides: number): Point [] {
    const minSide = Math.min(dimension.width, dimension.height);

    const initialPoint = new Point(0, 0);
    let angle = 0;
    let rayon = 0;
    let decalageX = 1.0;
    let decalageY = 1.0;
    if (dimension.width === minSide) {
      rayon = minSide * MULTIPLICATEURX [sides - 1] ;
      decalageY = ((DECALAGEY [sides - 1])) ;
    } else {
      const ratio = dimension.width / dimension.height;
      if ( ratio <= RATIOTRANSITION [sides - 1]) {
        rayon =
          minSide * MULTIPLICATEURX [sides - 1] * FACTEURTRANSITION [sides - 1];
        decalageY = ((DECALAGEY [sides - 1])) ;
        if (sides === 3 || sides === 6 || sides === 10) {
          decalageX = ratio * FACTEURTRANSITION [sides - 1];
          rayon = minSide * MULTIPLICATEURX [sides - 1] * ratio;
        }
        if (sides === 6 ) {
          decalageY *= (ratio) * FACTEURTRANSITION [sides - 1];
        }
        if (sides === 10) {
          decalageY = FACTEURTRANSITION [sides - 1];

        }
      } else {
        rayon = minSide * (MULTIPLICATEURY [sides - 1]);
        decalageX = ((DECALAGEX [sides - 1])) ;
      }
    }
    const sideLength = rayon * Math.sin(Math.PI / sides);
    const points: Point [] = []
    if (upLeftCorner.x < mouseDownPoint.x) {
      initialPoint.x =
        mouseDownPoint.x - minSide * decalageX / 2 - sideLength / 2;
    } else {
      initialPoint.x =
        mouseDownPoint.x + minSide * decalageX / 2 - sideLength / 2;
    }
    if (upLeftCorner.y === mouseDownPoint.y) {
      initialPoint.y = upLeftCorner.y + minSide * decalageY;
    } else {
      initialPoint.y = mouseDownPoint.y;
    }
    points.push(initialPoint)
    let i = 1;

    while (i < sides) {
    const lastPoint = {x: 0, y: 0};
    lastPoint.x = points[i - 1].x + sideLength * Math.cos(angle);
    lastPoint.y = points[i - 1].y - sideLength * Math.sin(angle);
    points.push(new Point(lastPoint.x, lastPoint.y));
    angle += (Math.PI * 2) / sides;
    i += 1;
    }
    // this.putCornersInRectangle(upLeftCorner, dimension, points);
    return points;
  }
  getRectangleUpLeftCorner(initialPoint: Point, oppositePoint: Point): Point {
    const deltaX = oppositePoint.x - initialPoint.x;
    const deltaY = oppositePoint.y - initialPoint.y;
    if (deltaX > 0 && deltaY < 0) {
      return new Point(initialPoint.x, initialPoint.y + deltaY);
    }
    if (deltaX < 0 && deltaY < 0) {
      return new Point(initialPoint.x + deltaX, initialPoint.y + deltaY);
    }
    if (deltaX < 0 && deltaY > 0) {
      return new Point(initialPoint.x + deltaX, initialPoint.y);
    }
    return initialPoint;
  }

  getEllipseRadius(initialPoint: Point, oppositePoint: Point): Radius {
    const rectDims = this.getRectangleSize(initialPoint, oppositePoint);
    return {
      rx: rectDims.width / 2,
      ry: rectDims.height / 2
    }
  }

  getEllipseCenter(initialPoint: Point, oppositePoint: Point): Point {
    const initToCenterv = new Point(
      0.5 * (oppositePoint.x - initialPoint.x),
      0.5 * (oppositePoint.y - initialPoint.y)
    );

    return new Point(
      initialPoint.x + initToCenterv.x,
      initialPoint.y + initToCenterv.y
    );
  }

  getCircleCenter(initialPoint: Point, oppositePoint: Point): Point {
    const xSign = Math.sign(oppositePoint.x - initialPoint.x);
    const ySign = Math.sign(oppositePoint.y - initialPoint.y);

    const re = this.getRectangleSize(initialPoint, oppositePoint);
    const m = Math.min(re.width, re.height);
    return new Point(
      initialPoint.x + xSign * (m * 0.5),
      initialPoint.y + ySign * (m * 0.5)
    )
  }
}
