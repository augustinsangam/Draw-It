import { Injectable } from '@angular/core';
import { Dimension } from '../shape/common/dimension';
import { Radius } from '../shape/common/ellipse';
import { Point } from '../shape/common/point';

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

  getPolygonCornersFromRectangle(
    mouseDownPoint: Point,
    upLeftCorner: Point,
    dimension: Dimension,
    sides: number,
    strokeWidth: number): Point[] {
    const borderX = strokeWidth * FACTEUR_BORDER_X[sides - 1];
    const borderY = strokeWidth * FACTEUR_BORDER_Y[sides - 1];
    const minSide = Math.min(dimension.width, dimension.height);
    const initialPoint = new Point(0, 0);
    let angle = (sides % 2 === 0) ? (Math.PI) / sides : 0;
    let rayon = 0;
    let decalageX = 1.0;
    let decalageY = 1.0;
    const ratio = dimension.width / dimension.height;
    if (dimension.width === minSide) {
      rayon = Math.max((minSide - borderX) * MULTIPLICATEUR_X[sides - 1], 0);
      decalageY = DECALAGE_Y[sides - 1];
      if (ratio >= RATIO_TRANSITION_HEIGHT && (sides === HEXAGONE_SIDES || sides === DECAGONE_SIDES)) {
        rayon = minSide - borderX;
        decalageY *= FACTEUR_DECALAGE_Y[sides - 1];
        decalageX = FACTEUR_DECALAGE_X[sides - 1];
      }
    } else {
      if (ratio <= RATIO_TRANSITION_WIDTH[sides - 1]) {
        rayon = Math.max((minSide - borderX) * MULTIPLICATEUR_X[sides - 1] * FACTEUR_TRANSITION[sides - 1], 0);
        decalageY = DECALAGE_Y[sides - 1];
        decalageY *= FACTEUR_DECALAGE_Y[sides - 1];
        decalageX = FACTEUR_DECALAGE_X[sides - 1];
        if (sides === TRIANGLE_SIDES) {
          decalageX = ratio * FACTEUR_TRANSITION[sides - 1];
          rayon = Math.max((minSide - borderX) * MULTIPLICATEUR_X[sides - 1] * (ratio), 0);
        }
      } else {
        rayon = Math.max((minSide - borderX) * (MULTIPLICATEURY[sides - 1]), 0);
        decalageX = ((DECALAGE_X[sides - 1]));
      }
    }
    const sideLength = rayon * Math.sin(Math.PI / sides);
    const points: Point[] = [];
    const translation = (sides % 2 === 0) ? 0 : sideLength / 2;
    if (upLeftCorner.x < mouseDownPoint.x) {
      initialPoint.x = mouseDownPoint.x - minSide * decalageX / 2 - translation;
    } else {
      initialPoint.x = mouseDownPoint.x + minSide * decalageX / 2 - translation;
    }
    if (upLeftCorner.y === mouseDownPoint.y) {
      let index = 1;
      let decalage = upLeftCorner.y;
      let angleY = (Math.PI * 2) / sides;
      while ((index <= Math.floor(sides / 2)) && (sides % 2 !== 0)) {
        decalage += sideLength * Math.sin(angleY);
        angleY += (Math.PI * 2) / sides;
        index += 1;
      }
      initialPoint.y = (sides % 2 === 0) ? upLeftCorner.y + minSide * decalageY - borderY / 2 : decalage + borderY / 2;
    } else {
      initialPoint.y = mouseDownPoint.y - borderY / 2;
    }
    points.push(initialPoint);
    let i = 1;

    while (i < sides) {
      const lastPoint = { x: 0, y: 0 };
      lastPoint.x = points[i - 1].x + sideLength * Math.cos(angle);
      lastPoint.y = points[i - 1].y - sideLength * Math.sin(angle);
      points.push(new Point(lastPoint.x, lastPoint.y));
      angle += (Math.PI * 2) / sides;
      i += 1;
    }
    return points;
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
