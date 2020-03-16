import { Injectable } from '@angular/core';
import { Radius } from '../shape/common/ellipse';
import { Point } from '../shape/common/point';
import { Dimension } from '../shape/common/rectangle';
// tslint:disable:no-magic-numbers
// cette regle est desactiviee car toutes les constantes sont utilisee pour que
// les polygones garde toujours l'air maximale du rectangle inscrit.

// line constants
const MINIMAL_3PX_DISTANCE = 3;
const MINIMAL_ALIGN_ANGLE = Math.PI / 8;
const MAXIMAL_ALIGN_ANGLE = 3 * Math.PI / 8;

// polygone constants
const MULTIPLICATEUR_X: number[] =
  [0, 0, 1.15, 1.0, 1.05, 1.1, 1.015, 1.0, 1.01, 1.0, 1.01, 1.0];
const MULTIPLICATEURY: number[] =
  [0, 0, 1.32, 1.0, 1.1, 1.0, 1.05, 1.0, 1.027, 1.0, 1.02, 1.0];
const DECALAGE_X: number[] =
  [0, 0, 1.15, 1.0, 1.05, 0.9, 1.025, 1.0, 1.0, 1.0, 1.02, 1.0];
const DECALAGE_Y: number[] =
  [0, 0, 0.88, 1.0, 0.97, 1.1, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
const RATIO_TRANSITION_WIDTH: number[] =
  [0, 0, 1.15, 1.0, 1.04, 1.1, 1.08, 1.0, 1.04, 1.06, 1.08, 1.0];
const FACTEUR_TRANSITION: number[] =
  [0, 0, 1.0, 1.0, 1.01, 0.909, 1.02, 1.0, 1.0, 1.0, 1.0, 1.0];
const FACTEUR_DECALAGE_X: number[] =
  [0, 0, 1.0, 1.0, 1.0, 0.9, 1.0, 1.0, 1.0, 0.95, 1.0, 1.0];
const FACTEUR_DECALAGE_Y: number[] =
  [0, 0, 1.0, 1.0, 1.0, 0.92, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
const FACTEUR_BORDER_X: number[] =
  [0, 0, 1.8, 1.38, 1.2, 1.0, 1.0, 1.1, 1.05, 1.0, 1.3, 1.01];
const FACTEUR_BORDER_Y: number[] =
  [0, 0, 2.0, 1.38, 1.2, 1.0, 1.0, 1.1, 1.05, 1.0, 1.03, 1.01];
const RATIO_TRANSITION_HEIGHT = 0.9;
const TRIANGLE_SIDES = 3;
const HEXAGONE_SIDES = 6;
const DECAGONE_SIDES = 10;
interface PolygonProperties {
  radius: number;
  deltaX: number;
  deltaY: number;
  sides: number;
  angle: number;
  deltaBorderX: number;
  deltaBorderY: number;
  initialPoint: Point;
}

@Injectable({
  providedIn: 'root'
})
export class MathService {
  distanceIsLessThan3Pixel(point1: Point, point2: Point): boolean {
    return (
      Math.abs(point1.x - point2.x) <= MINIMAL_3PX_DISTANCE &&
      Math.abs(point1.y - point2.y) <= MINIMAL_3PX_DISTANCE
    );
  }

  findAlignedSegmentPoint(mousePosition: Point, lastPoint: Point): Point {
    const deltaX = mousePosition.x - lastPoint.x;
    const deltaY = mousePosition.y - lastPoint.y;
    const angleAxeX = Math.atan(deltaY / deltaX);
    if (Math.abs(angleAxeX) < MINIMAL_ALIGN_ANGLE) {
      return new Point(mousePosition.x, lastPoint.y);
    }
    if (Math.abs(angleAxeX) > MAXIMAL_ALIGN_ANGLE) {
      return new Point(lastPoint.x, mousePosition.y);
    }
    if (deltaY * deltaX > 0) {
      return new Point(mousePosition.x, lastPoint.y + deltaX);
    }
    return new Point(mousePosition.x, lastPoint.y - deltaX);
  }

  getRectangleSize(initialPoint: Point, oppositePoint: Point, strokeWidth?: number): Dimension {
    const border = (strokeWidth === undefined) ? 0 : strokeWidth;
    const x = Math.max(Math.abs(oppositePoint.x - initialPoint.x) - border, 0);
    const y = Math.max(Math.abs(oppositePoint.y - initialPoint.y) - border, 0);
    return { height: y, width: x };
  }

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
  computePolygonRadius(rectDim: Dimension, properties: PolygonProperties): void {
    const minSide = Math.min(rectDim.width, rectDim.height);
    const ratio = rectDim.width / rectDim.height;
    const exeptionalCase = properties.sides === HEXAGONE_SIDES || properties.sides === DECAGONE_SIDES;
    properties.radius = Math.max((minSide - properties.deltaBorderX) * MULTIPLICATEUR_X[properties.sides - 1], 0);
    properties.deltaY = DECALAGE_Y[properties.sides - 1];
    properties.deltaX = FACTEUR_DECALAGE_X[properties.sides - 1];
    if (ratio >= RATIO_TRANSITION_HEIGHT && exeptionalCase && rectDim.width === minSide ) {
        properties.radius = minSide - properties.deltaBorderX;
        properties.deltaY *= FACTEUR_DECALAGE_Y[properties.sides - 1];
    }
    if (ratio <= RATIO_TRANSITION_WIDTH[properties.sides  - 1] && rectDim.width !== minSide) {
        const expansionX =  MULTIPLICATEUR_X[properties.sides - 1] * FACTEUR_TRANSITION[properties.sides - 1];
        properties.radius = Math.max((minSide - properties.deltaBorderX) * expansionX, 0);
        properties.deltaY = DECALAGE_Y[properties.sides  - 1] * FACTEUR_DECALAGE_Y[properties.sides - 1];

        if (properties.sides  === TRIANGLE_SIDES) {
          properties.deltaX = ratio * FACTEUR_TRANSITION[properties.sides  - 1];
          properties.radius = Math.max((minSide - properties.deltaBorderX) * MULTIPLICATEUR_X[properties.sides  - 1] * (ratio), 0);
        }
    }
    if (ratio > RATIO_TRANSITION_WIDTH[properties.sides  - 1] && rectDim.width !== minSide) {
        properties.radius = Math.max((minSide - properties.deltaBorderX) * (MULTIPLICATEURY[properties.sides  - 1]), 0);
        properties.deltaX = ((DECALAGE_X[properties.sides  - 1]));
    }
  }

  computeInitialPointPosition(dimension: Dimension, mouseDownPoint: Point,
                              upLeftCorner: Point, properties: PolygonProperties): void {
    const minSide = Math.min(dimension.width, dimension.height);
    const sideLength = properties.radius * Math.sin(Math.PI / properties.sides);
    const translation = (properties.sides % 2 === 0) ? 0 : sideLength / 2;
    properties.initialPoint.x = upLeftCorner.x < mouseDownPoint.x ? mouseDownPoint.x - minSide * properties.deltaX / 2 - translation :
                                                                    mouseDownPoint.x + minSide * properties.deltaX / 2 - translation;
    if (upLeftCorner.y !== mouseDownPoint.y) {
      properties.initialPoint.y = mouseDownPoint.y - properties.deltaBorderY  / 2;
      return ;
    }

    let index = 1;
    let decalage = upLeftCorner.y;
    let angleY = (Math.PI * 2) / properties.sides;
    while ((index <= Math.floor(properties.sides / 2)) && (properties.sides % 2 !== 0)) {
      decalage += sideLength * Math.sin(angleY);
      angleY += (Math.PI * 2) / properties.sides;
      index += 1;
    }
    const evenPointY = upLeftCorner.y + minSide * properties.deltaY;
    properties.initialPoint.y = (properties.sides % 2 === 0) ? evenPointY - properties.deltaBorderY / 2 :
                                                               decalage + properties.deltaBorderY  / 2;
  }
  computeAllPolygonPoints(properties: PolygonProperties): Point [] {
    const sideLength = properties.radius * Math.sin(Math.PI / properties.sides);
    const points: Point[] = [];
    points.push(properties.initialPoint);
    let i = 1;

    while (i < properties.sides) {
      const lastPoint = { x: 0, y: 0 };
      lastPoint.x = points[i - 1].x + sideLength * Math.cos(properties.angle);
      lastPoint.y = points[i - 1].y - sideLength * Math.sin(properties.angle);
      points.push(new Point(lastPoint.x, lastPoint.y));
      properties.angle += (Math.PI * 2) / properties.sides;
      i += 1;
    }
    return points;
  }

  getPolygonCornersFromRectangle(
    mouseDownPoint: Point,
    upLeftCorner: Point,
    dimension: Dimension,
    sidesCount: number,
    strokeWidth: number): Point[] {

    const initialAngle = (sidesCount % 2 === 0) ? (Math.PI) / sidesCount : 0;
    const properties = {deltaX: 1.0, deltaY: 1.0,
                        sides: sidesCount, angle: initialAngle,
                        radius: 0, initialPoint: new Point(0, 0),
                        deltaBorderX: strokeWidth * FACTEUR_BORDER_X[sidesCount - 1],
                        deltaBorderY: strokeWidth * FACTEUR_BORDER_Y[sidesCount - 1]};
    this.computePolygonRadius(dimension, properties);
    this.computeInitialPointPosition(dimension, mouseDownPoint, upLeftCorner, properties);
    return this.computeAllPolygonPoints(properties);
  }

  getRectangleUpLeftCorner(initialPoint: Point, oppositePoint: Point, strokeWidth?: number): Point {
    const border = (strokeWidth === undefined) ? 0 : strokeWidth / 2;
    const deltaX = oppositePoint.x - initialPoint.x;
    const deltaY = oppositePoint.y - initialPoint.y;
    if (deltaX > 0 && deltaY < 0) {
      return new Point(initialPoint.x + border, initialPoint.y + deltaY + border);
    }
    if (deltaX < 0 && deltaY < 0) {
      return new Point(initialPoint.x + deltaX + border, initialPoint.y + deltaY + border);
    }
    if (deltaX < 0 && deltaY > 0) {
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

    // TODO : variables

    if (radius.rx + border / 2 < 0
        || radius.ry + border / 2 < 0
        || (radius.rx < border / 2 && radius.ry < border / 2)
    ) {
      radius = { rx: 0, ry: 0 };
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

    const rectangleSize = this.getRectangleSize(initialPoint, oppositePoint);
    const min = Math.min(rectangleSize.width, rectangleSize.height);
    return new Point(
      initialPoint.x + xSign * (min / 2),
      initialPoint.y + ySign * (min / 2)
    );
  }
}
