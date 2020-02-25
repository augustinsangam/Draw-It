import { ElementRef, Renderer2 } from '@angular/core';

import { MathematicsService } from '../../../mathematics/mathematics.service';
import { AbstractShape } from './abstract-shape';
import { Point } from './point';

// Class tested in ../Polygone/polygone-logic.component.spec.ts
export class Polygone extends AbstractShape {

  constructor(
    protected renderer: Renderer2,
    public element: ElementRef,
    private mathService: MathematicsService,
    private sides: number,
  ) {
      super(renderer, element);
    }

  insertPolygonInSVG(points: Point []): void {
    let atribute = '';
    for (const point of points) {
      atribute += point.x.toString() + ',' + point.y.toString() + ' ';
    }
    this.renderer.setAttribute(this.element, 'points', atribute);
  }

  drawPolygonFromRectangle(mouseDownPoint: Point, oppositePoint: Point): void {
    const dimensions = this.mathService.getRectangleSize(
      mouseDownPoint,
      oppositePoint
    );
    const upLeftCorner = this.mathService.getRectangleUpLeftCorner(
      mouseDownPoint,
      oppositePoint
    );
    const points: Point [] = this.mathService.getPolynomeCornersFromRectangle(
     mouseDownPoint, upLeftCorner, dimensions, this.sides);

    console.log(points, 'yeeeeeeeeeeeeeeeeeeeeeee')
    this.insertPolygonInSVG(points);
  }

}