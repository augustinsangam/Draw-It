import { ElementRef, Renderer2 } from '@angular/core';
import { MathService } from '../../mathematics/tool.math-service.service';
import { Point } from './Point';

// Class tested in ../Rectangle/rectangle-logic.component.spec.ts
export class Rectangle {
  private backgoundProperties: BackGroundProperties;
  private strokeProperties: StrokeProperties;

  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    private mathService: MathService
  ) {
      this.backgoundProperties = BackGroundProperties.Filled;
      this.strokeProperties = StrokeProperties.Filled;
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

  setParameters(background: BackGroundProperties, stroke: StrokeProperties)
  : void {

    if (stroke === StrokeProperties.None) {
      this.renderer.setAttribute(this.element, 'fill', 'none');
    } else if (stroke === StrokeProperties.Dashed) {
        this.renderer.setAttribute(this.element, 'stroke-dasharray', '5,5');
    }
    this.backgoundProperties = background;
    this.strokeProperties = stroke;
  }

  setCss(style: Style): void {
    if (this.backgoundProperties === BackGroundProperties.Filled) {
      this.renderer.setAttribute(this.element, 'fill-opacity', style.opacity);
      this.renderer.setAttribute(this.element, 'fill', style.fillColor);
    }
    if (this.strokeProperties !== StrokeProperties.None) {
      this.renderer.setAttribute(
        this.element, 'stroke-width', style.strokeWidth);
      this.renderer.setAttribute(this.element, 'stroke', style.strokeColor);
    }
  }
}

export interface Dimension {
  width: number,
  height: number
}

export interface Style {
  strokeWidth: string,
  strokeColor: string,
  fillColor: string,
  opacity: string // from 0 to one
}
export enum BackGroundProperties {
  Filled,
  None
}
export enum StrokeProperties {
  Filled,
  Dashed,
  None
}
