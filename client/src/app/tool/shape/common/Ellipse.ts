import {ElementRef, Renderer2} from '@angular/core';
import {MathService} from '../../mathematics/tool.math-service.service';
import {Point} from './Point';

const SEMIOPACITY = '0.5';
export class Ellipse {
  private filled: boolean;
  private initialPoint: Point;
  private style: Style;

  constructor(
    initialPoint: Point,
    private renderer: Renderer2,
    private element: ElementRef,
    private mathService: MathService
  ) {
    this.filled = true;
    this.initialPoint = initialPoint;
    console.log('ellipse constructor');
  }

  insertEllipseInSVG(center: Point, dimension: Dimension) {
    this.renderer.setAttribute(this.element, 'cx', center.x.toString());
    this.renderer.setAttribute(this.element, 'cy', center.y.toString());
    this.renderer.setAttribute(
      this.element,
      'rx',
      (dimension.width * 0.5).toString()
    );
    this.renderer.setAttribute(
      this.element,
      'ry',
      (dimension.height * 0.5).toString()
    );
  }

  simulateEllipse(oppositePoint: Point): void {
    const dimensions = this.mathService.getRectangleSize(
      this.initialPoint,
      oppositePoint
    );
    const transformedPoint = this.mathService.getRectangleUpLeftCorner(
      this.initialPoint,
      oppositePoint
    );
    this.insertEllipseInSVG(transformedPoint, dimensions);
    this.setOpacity(SEMIOPACITY);
  }

  simulateCircle(oppositePoint: Point): void {
    const dimensions = this.mathService.getRectangleSize(
      this.initialPoint,
      oppositePoint
    );
    const transformedPoint = this.mathService.getRectangleUpLeftCorner(
      this.initialPoint,
      oppositePoint
    );
    this.insertEllipseInSVG(transformedPoint, dimensions);
    this.setOpacity(SEMIOPACITY);
  }

  setParameters(style: Style): void {
    this.style = style;
    const styleAttr = `fill:${this.style.fillColor};`
                    + `stroke:${this.style.borderColor};`
                    + `stroke-width:${this.style.borderWidth};`;
    this.renderer.setAttribute(this.element, 'style', styleAttr);
    this.filled = style.filled;
  }

  setOpacity(opacityPercent: string): void {
    if (this.filled) {
      this.renderer.setAttribute(this.element, 'fill-opacity', opacityPercent);
    } else {
      this.renderer.setAttribute(this.element, 'fill', 'none');
    }
    this.renderer.setAttribute(this.element, 'stroke-opacity', opacityPercent);
  }

}

interface Dimension {
  width: number,
  height: number
}

interface Style {
  borderWidth: string,
  borderColor: string,
  fillColor: string,
  filled: boolean
}
