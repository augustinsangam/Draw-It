import { Renderer2 } from '@angular/core';
import { MathService } from '../../mathematics/tool.math-service.service';
import { AbstractShape } from './abstract-shape';
import { Dimension } from './dimension';
import { Point } from './point';

// Class tested in ../Rectangle/rectangle-logic.component.spec.ts
export class Rectangle extends AbstractShape {

  constructor(
    protected renderer: Renderer2,
    public element: SVGElement,
    private mathService: MathService
  ) {
      super(renderer, element);
    }

  insertRectangleInSVG(upLeftCorner: Point, dimension: Dimension): void {
    this.renderer.setAttribute(this.element, 'x', upLeftCorner.x.toString());
    this.renderer.setAttribute(this.element, 'y', upLeftCorner.y.toString());
    this.renderer.setAttribute(
      this.element,
      'width',
      dimension.width.toString()
    );
    this.renderer.setAttribute(
      this.element,
      'height',
      dimension.height.toString()
    );
  }

  dragRectangle(mouseDownPoint: Point, mouseMovePoint: Point, strokeWidth?: number): void {
    const dimensions = this.mathService.getRectangleSize(
      mouseDownPoint,
      mouseMovePoint,
      strokeWidth
    );
    const transformedPoint = this.mathService.getRectangleUpLeftCorner(
      mouseDownPoint,
      mouseMovePoint,
      strokeWidth
    );
    this.insertRectangleInSVG(transformedPoint, dimensions);
  }

  dragSquare(mouseDownPoint: Point, mouseMovePoint: Point, strokeWidth?: number): void {
    const transformedPoint = this.mathService.transformRectangleToSquare(
      mouseDownPoint,
      mouseMovePoint
    );
    const finalPoint = this.mathService.getRectangleUpLeftCorner(
      mouseDownPoint,
      transformedPoint,
      strokeWidth
    );
    const squareDimension = this.mathService.getRectangleSize(
      mouseDownPoint,
      transformedPoint,
      strokeWidth
    );
    this.insertRectangleInSVG(finalPoint, squareDimension);
  }
}
