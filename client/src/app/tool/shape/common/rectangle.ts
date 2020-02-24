import { ElementRef, Renderer2 } from '@angular/core';

import { MathematicsService } from '../../../mathematics/mathematics.service';
import { AbstractShape } from './abstract-shape';
import { Point } from './point';

export interface Dimension {
  width: number;
  height: number;
}

// Class tested in ../Rectangle/rectangle-logic.component.spec.ts
export class Rectangle extends AbstractShape {

  constructor(
    protected renderer: Renderer2,
    public element: ElementRef,
    private mathService: MathematicsService,
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

  dragRectangle(mouseDownPoint: Point, mouseMovePoint: Point): void {
    const dimensions = this.mathService.getRectangleSize(
      mouseDownPoint,
      mouseMovePoint
    );
    const transformedPoint = this.mathService.getRectangleUpLeftCorner(
      mouseDownPoint,
      mouseMovePoint
    );
    this.insertRectangleInSVG(transformedPoint, dimensions);
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
