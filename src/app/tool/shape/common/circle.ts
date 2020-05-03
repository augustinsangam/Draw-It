import { Renderer2 } from '@angular/core';
import { Point } from './point';

export class Circle {

  static set( center: Point,
              renderer: Renderer2,
              element: SVGElement,
              radius: string,
              color: string
  ): void {
    renderer.setAttribute(element, 'cx', center.x.toString());
    renderer.setAttribute(element, 'cy', center.y.toString());
    renderer.setAttribute(element, 'r', radius);
    renderer.setAttribute(element, 'fill', color);
  }
}
