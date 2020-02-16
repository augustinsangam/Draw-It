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
  }

  insertEllipseInSVG(center: Point, radius: Radius) {
    this.renderer.setAttribute(this.element, 'cx', (center.x).toString());
    this.renderer.setAttribute(this.element, 'cy', (center.y).toString());
    this.renderer.setAttribute(
      this.element,
      'rx',
      (radius.rx).toString()
    );
    this.renderer.setAttribute(
      this.element,
      'ry',
      (radius.ry).toString()
    );
  }

  simulateEllipse(oppositePoint: Point): void {
    const radius = this.mathService.getEllipseRadius(
      this.initialPoint,
      oppositePoint
    );
    const center = this.mathService.getEllipseCenter(
      this.initialPoint,
      oppositePoint
    );
    this.insertEllipseInSVG(center, radius);
    this.setOpacity(SEMIOPACITY);
  }

  simulateCircle(oppositePoint: Point): void {
    const radius = this.mathService.getEllipseRadius(
      this.initialPoint,
      oppositePoint
    );
    const center = this.mathService.getEllipseCenter(
      this.initialPoint,
      oppositePoint
    );
    this.insertEllipseInSVG(
      center,
      {
        rx: Math.min(radius.rx, radius.ry),
        ry: Math.min(radius.rx, radius.ry)
    });
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
      this.renderer.setAttribute(this.element, 'fill-opacity', '0.0');
    }
    this.renderer.setAttribute(this.element, 'stroke-opacity', opacityPercent);
  }

}

// TODO maybe move it to somewhere else, it is exported because needed
//  in tool.math-service.service.ts
export interface Radius {
  ry: number
  rx: number,
}

interface Style {
  borderWidth: string,
  borderColor: string,
  fillColor: string,
  filled: boolean
}
