import { ElementRef, Renderer2 } from '@angular/core';
import { Point } from '../../common/Point';
import { MathService } from '../../mathematics/tool.math-service.service';
import { Dimension } from './Dimension';
import { Style } from './Style';

export class Rectangle {
  private filled: boolean;
  private initialPoint: Point;
  private mathService: MathService;
  private style: Style

  constructor(
    initialPoint: Point,
    private renderer: Renderer2,
    private element: ElementRef
  ) {
    this.filled = true;
    this.initialPoint = initialPoint;
    // TODO: Do not recreate
    this.mathService = new MathService();
  }

  drawRectangle(upLeftCorner: Point, dimension: Dimension): void {
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

  drawTemporaryRectangle(oppositePoint: Point): void {
    const dimensions = this.mathService.getRectangleSize(
      this.initialPoint,
      oppositePoint
    );
    const transformedPoint = this.mathService.getRectangleUpLeftCorner(
      this.initialPoint,
      oppositePoint
    );
    this.drawRectangle(transformedPoint, dimensions);
    this.setOpacity('0.55');
  }
  drawTemporarySquare(oppositePoint: Point): void {
    const transformedPoint = this.mathService.transformRectangleToSquare(
      this.initialPoint,
      oppositePoint
    );
    const finalPoint = this.mathService.getRectangleUpLeftCorner(
      this.initialPoint,
      transformedPoint
    );
    const squareDimension = this.mathService.getRectangleSize(
      this.initialPoint,
      transformedPoint
    );
    this.drawRectangle(finalPoint, squareDimension);
    this.setOpacity('0.55');
  }
  setParameters(style: Style): void {
    this.style = style;
    const styleAtr = `fill:${this.style.fillColor};`
                   + `stroke:${this.style.borderColor};`
                   + `stroke-width:${this.style.borderWidth}`;
    this.renderer.setAttribute(this.element, 'style', styleAtr);
    this.filled = style.filled;
  }
  setOpacity(opacityPourcent: string): void {
    if (this.filled) {
      this.renderer.setAttribute(this.element, 'fill-opacity', opacityPourcent);
    } else {
      this.renderer.setAttribute(this.element, 'fill-opacity', '0.0');
    }
    this.renderer.setAttribute(this.element, 'stroke-opacity', opacityPourcent);
  }
}
