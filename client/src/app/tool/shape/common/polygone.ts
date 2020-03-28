import { Renderer2 } from '@angular/core';
import { MathService } from '../../mathematics/tool.math-service.service';
import { PolygoneService } from '../polygone/polygone.service';
import { AbstractShape } from './abstract-shape';
import { Point } from './point';

// Class tested in ../Polygone/polygone-logic.component.spec.ts
export class Polygone extends AbstractShape {

  constructor(
    protected renderer: Renderer2,
    public element: SVGElement,
    private mathService: MathService,
    private sides: number,
    protected polygonService?: PolygoneService
  ) {
      super(renderer, element, polygonService);
    }

  insertPolygonInSVG(points: Point []): void {
    let atribute = '';
    for (const point of points) {
      atribute += `${point.x} ${point.y} `;
    }
    this.renderer.setAttribute(this.element, 'points', atribute);
  }

  drawPolygonFromRectangle(mouseDownPoint: Point, oppositePoint: Point, border: number): void {
    const dimensions = this.mathService.getRectangleSize(
      mouseDownPoint,
      oppositePoint
    );
    const upLeftCorner = this.mathService.getRectangleUpLeftCorner(
      mouseDownPoint,
      oppositePoint
    );
    const points: Point [] = this.mathService.getPolygonCornersFromRectangle(
      mouseDownPoint, upLeftCorner, dimensions, this.sides, border);
    this.insertPolygonInSVG(points);
    }
}
