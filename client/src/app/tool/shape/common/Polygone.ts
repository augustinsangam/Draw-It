import { ElementRef, Renderer2 } from '@angular/core';
import { MathService } from '../../mathematics/tool.math-service.service';
import {AbstractShape} from './AbstractShape'
import { Point } from './Point';

// Class tested in ../Polygone/polygone-logic.component.spec.ts
export class Polygone extends AbstractShape {

  constructor(
    protected renderer: Renderer2,
    public element: ElementRef,
    private mathService: MathService
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
    this.mathService.getRectangleSize(mouseDownPoint, oppositePoint);
  }

}
