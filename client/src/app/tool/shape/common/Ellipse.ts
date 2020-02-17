import {ElementRef, Renderer2} from '@angular/core';
import {MathService} from '../../mathematics/tool.math-service.service';
import {AbstractShape} from './AbstractShape';
import {Point} from './Point';

export class Ellipse extends AbstractShape {

  constructor(
    initialPoint: Point,
    protected renderer: Renderer2,
    // TODO element sprivate ?
    public element: ElementRef,
    private mathService: MathService
  ) {
    super(renderer, element);
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

  simulateEllipse(initialPoint: Point, oppositePoint: Point): void {
    const radius = this.mathService.getEllipseRadius(
      initialPoint,
      oppositePoint
    );
    const center = this.mathService.getEllipseCenter(
      initialPoint,
      oppositePoint
    );
    this.insertEllipseInSVG(center, radius);
  }

  simulateCircle(initialPoint: Point, oppositePoint: Point): void {
    const radius = this.mathService.getEllipseRadius(
      initialPoint,
      oppositePoint
    );
    const center = this.mathService.getCircleCenter(
      initialPoint,
      oppositePoint
    );
    this.insertEllipseInSVG(
      center,
      {
        rx: Math.min(radius.rx, radius.ry),
        ry: Math.min(radius.rx, radius.ry)
    });
  }
}

export interface Radius {
  ry: number
  rx: number,
}
