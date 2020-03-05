import { Injectable } from '@angular/core';
import { Radius } from '../shape/common/ellipse';
import { Point } from '../shape/common/point';
import { Dimension } from '../shape/common/rectangle';

const MINIMAL_DISTANCE = 3;
const MULTIPLICATEUR_X: number[] =
  [0, 0, 1.15, 1.415, 1.05, 1.00, 1.015, 1.08, 1.01, 1.0, 1.01, 1.03];
const MULTIPLICATEURY: number[] =
  [0, 0, 1.32, 1.415, 1.1, 1.155, 1.05, 1.08, 1.027, 1.05, 1.02, 1.03];
const DECALAGE_X: number[] =
  [0, 0, 1.15, 1.0, 1.045, 1.15, 1.025, 1.0, 1.0, 1.06, 1.02, 1.0];
const DECALAGE_Y: number[] =
  [0, 0, 1.0, 1.0, 0.97, 0.88, 1.0, 1.0, 1.0, 0.95, 1.0, 1.0];
const RATIO_TRANSITION: number[] =
  [0, 0, 1.15, 1.0, 1.04, 1.15, 1.08, 1.0, 1.04, 1.06, 1.08, 1.0];
const FACTEUR_TRANSITION: number[] =
  [0, 0, 1.0, 1.0, 1.01, 1.0, 1.02, 1.0, 1.0, 1.0, 1.0, 1.0];

@Injectable({
  providedIn: 'root'
})
export class MathService {
  constructor() {}

  distanceIsLessThan3Pixel(point1: Point, point2: Point): boolean {
    return (
      Math.abs(point1.x - point2.x) <= MINIMAL_DISTANCE &&
      Math.abs(point1.y - point2.y) <= MINIMAL_DISTANCE
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

  getRectangleSize(initialPoint: Point, oppositePoint: Point, strokeWidth?: number): Dimension {
    const border = (strokeWidth === undefined) ? 0 : strokeWidth;
    const x = Math.max(Math.abs(oppositePoint.x - initialPoint.x) - border, 1);
    const y = Math.max(Math.abs(oppositePoint.y - initialPoint.y) - border, 1);
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
      rayon = minSide * MULTIPLICATEUR_X [sides - 1] ;
      decalageY = ((DECALAGE_Y [sides - 1])) ;
    } else {
      const ratio = dimension.width / dimension.height;
      if ( ratio <= RATIO_TRANSITION [sides - 1]) {
        rayon =
          minSide * MULTIPLICATEUR_X [sides - 1] * FACTEUR_TRANSITION [sides - 1];
        decalageY = ((DECALAGE_Y [sides - 1])) ;
        if (sides === 3 || sides === 6 || sides === 10) {
          decalageX = ratio * FACTEUR_TRANSITION [sides - 1];
          rayon = minSide * MULTIPLICATEUR_X [sides - 1] * ratio;
        }
        if (sides === 6 ) {
          decalageY *= (ratio) * FACTEUR_TRANSITION [sides - 1];
        }
        if (sides === 10) {
          decalageY = FACTEUR_TRANSITION [sides - 1];

        }
      } else {
        rayon = minSide * (MULTIPLICATEURY [sides - 1]);
        decalageX = ((DECALAGE_X [sides - 1])) ;
      }
    }
    const sideLength = rayon * Math.sin(Math.PI / sides);
    const points: Point [] = [];
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
    points.push(initialPoint);
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

  getRectangleUpLeftCorner(initialPoint: Point, oppositePoint: Point, strokeWidth?: number): Point {
    const border = (strokeWidth === undefined) ? 0 : strokeWidth / 2;
    const deltaX = oppositePoint.x - initialPoint.x;
    const deltaY = oppositePoint.y - initialPoint.y;
    if (deltaX > 0 && deltaY < 0) {
      console.log(1);
      return new Point(initialPoint.x + border, initialPoint.y + deltaY + border);
    }
    if (deltaX < 0 && deltaY < 0) {
      console.log(2);
      return new Point(initialPoint.x + deltaX + border, initialPoint.y + deltaY + border);
    }
    if (deltaX < 0 && deltaY > 0) {
      console.log(3);
      return new Point(initialPoint.x + deltaX + border, initialPoint.y + border);
    }
    return new Point(initialPoint.x + border, initialPoint.y + border);
  }

  getEllipseRadius(initialPoint: Point, oppositePoint: Point, border: number): Radius {
    const rectDims = this.getRectangleSize(initialPoint, oppositePoint);
    let radius = {
      rx: Math.max(rectDims.width / 2 - border / 2, 0),
      ry: Math.max(rectDims.height / 2 - border / 2, 0)
    };
    if (radius.rx  + border / 2 < border / 2
      || radius.ry + border / 2 < border / 2) {
      radius = {rx: 0, ry: 0};
    }
    return radius;
  }

  getEllipseCenter(initialPoint: Point, oppositePoint: Point): Point {
    const initToCenterv = new Point(
      (oppositePoint.x - initialPoint.x) / 2,
      (oppositePoint.y - initialPoint.y) / 2
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
      initialPoint.x + xSign * (m / 2),
      initialPoint.y + ySign * (m / 2)
    );
  }
}
