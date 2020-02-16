import { ElementRef, Renderer2 } from '@angular/core';
import { MathService } from '../../mathematics/tool.math-service.service';
import {AbstractShape} from './AbstractShape'
import { Point } from './Point';

// Class tested in ../Rectangle/rectangle-logic.component.spec.ts
export class Rectangle extends AbstractShape {

  constructor(
    protected renderer: Renderer2,
    protected element: ElementRef,
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

  dragRectangle(mouseDownPoint: Point, mouseMovePoint: Point): void {
    const dimensions = this.mathService.getRectangleSize(
      mouseDownPoint,
      mouseMovePoint
    );
    const transformedPoint = this.mathService.getRectangleUpLeftCorner(
      mouseDownPoint,
      mouseMovePoint
    );
    this.insertPolygoneInSVG();
  }

  dragSquare(mouseDownPoint: Point, mouseMovePoint: Point): void {
    const transformedPoint = this.mathService.transformRectangleToSquare(
      mouseDownPoint,
      mouseMovePoint
    );
    const finalPoint = this.mathService.getRectangleUpLeftCorner(
      mouseDownPoint,
      transformedPoint
    );
    const squareDimension = this.mathService.getRectangleSize(
      mouseDownPoint,
      transformedPoint
    );
    this.insertRectangleInSVG(finalPoint, squareDimension);
  }

}
