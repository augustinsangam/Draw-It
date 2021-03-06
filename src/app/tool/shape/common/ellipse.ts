import { Renderer2 } from '@angular/core';
import { MathService } from '../../mathematics/tool.math-service.service';
import { EllipseService } from '../ellipse/ellipse.service';
import { AbstractShape } from './abstract-shape';
import { Point } from './point';

export interface Radius {
  ry: number;
  rx: number;
}

export class Ellipse extends AbstractShape {

  constructor(protected renderer: Renderer2,
              public element: SVGElement,
              private mathService: MathService,
              protected ellipseService: EllipseService
  ) {
    super(renderer, element, ellipseService);
  }

  insertEllipseInSVG(center: Point, radius: Radius): void {
    this.renderer.setAttribute(this.element, 'cx', center.x.toString());
    this.renderer.setAttribute(this.element, 'cy', center.y.toString());
    this.renderer.setAttribute(
      this.element, 'rx', radius.rx.toString());
    this.renderer.setAttribute(
      this.element, 'ry', radius.ry.toString()
    );
  }

  simulateEllipse(initialPoint: Point, oppositePoint: Point, border: number): void {
    const radius = this.mathService.getEllipseRadius(
      initialPoint,
      oppositePoint,
      border
    );
    const center = this.mathService.getEllipseCenter(
      initialPoint,
      oppositePoint
    );
    this.insertEllipseInSVG(center, radius);
  }

  simulateCircle(initialPoint: Point, oppositePoint: Point, border: number): void {
    const radius = this.mathService.getEllipseRadius(
      initialPoint,
      oppositePoint,
      border
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
