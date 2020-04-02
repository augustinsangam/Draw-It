import { Injectable } from '@angular/core';
import { Dimension } from '../shape/common/dimension';
import { Radius } from '../shape/common/ellipse';
import { Point } from '../shape/common/point';
import {CONSTANTS, MAXIMAL_ALIGN_ANGLE, MINIMAL_3PX_DISTANCE, MINIMAL_ALIGN_ANGLE,
        RATIO_TRANSITION_HEIGHT , Shape, ShapeConstants} from './tool.math-service-util';

export interface PolygonProperties {
  radius: number;
  deltaX: number;
  deltaY: number;
  sides: number;
  angle: number;
  deltaBorderX: number;
  deltaBorderY: number;
  initialPoint: Point;
  constants: ShapeConstants;
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
    const exeptionalCase = properties.sides === Shape.HEXAGONE || properties.sides === Shape.DECAGONE;
    properties.radius = Math.max((minSide - properties.deltaBorderX) * properties.constants.MULTIPLICATOR_X, 0);
    properties.deltaY = properties.constants.TRANSLATION_Y;
    properties.deltaX = properties.constants.FACTOR_TRANSLATION_X;

    if (ratio >= RATIO_TRANSITION_HEIGHT && exeptionalCase && rectDim.width === minSide ) {
        properties.radius = minSide - properties.deltaBorderX;
        properties.deltaY *= properties.constants.FACTOR_TRANSLATION_Y;
    }
    if (ratio <= properties.constants.RATIO_TRANSITION_WIDTH && rectDim.width !== minSide) {
        const expansionX =  properties.constants.MULTIPLICATOR_X * properties.constants.FACTOR_TRANSITION;
        properties.radius = Math.max((minSide - properties.deltaBorderX) * expansionX, 0);
        properties.deltaY = properties.constants.TRANSLATION_Y * properties.constants.FACTOR_TRANSLATION_Y;
        if (properties.sides  === Shape.TRIANGLE) {
          properties.deltaX = ratio * properties.constants.FACTOR_TRANSITION;
          properties.radius = Math.max((minSide - properties.deltaBorderX) * properties.constants.MULTIPLICATOR_X * (ratio), 0);
        }
    }
    if (ratio > properties.constants.RATIO_TRANSITION_WIDTH && rectDim.width !== minSide) {
        properties.radius = Math.max((minSide - properties.deltaBorderX) * (properties.constants.MULTIPLICATOR_Y), 0);
        properties.deltaX = properties.constants.TRANSLATION_X;
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
                        deltaBorderX: strokeWidth * (CONSTANTS.get(sidesCount as Shape) as ShapeConstants).FACTOR_BORDER_X,
                        deltaBorderY: strokeWidth * (CONSTANTS.get(sidesCount as Shape) as ShapeConstants).FACTOR_BORDER_Y,
                        constants: CONSTANTS.get(sidesCount as Shape) as ShapeConstants};
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

    const negativeRadius = (radius.rx + border / 2 < 0) || (radius.ry + border / 2 < 0);
    const radiusBiggerThanBorder = radius.rx < border / 2 && radius.ry < border / 2;
    if (negativeRadius || radiusBiggerThanBorder) {
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
