import { ElementRef, Renderer2 } from '@angular/core';

import { Point } from '../../common/Point';

export class Circle {
  constructor(private center: Point,
              private renderer: Renderer2,
              public element: ElementRef,
              private radius: string,
              private color: string) {
    this.renderer.setAttribute(this.element, 'cx'   , this.center.x.toString());
    this.renderer.setAttribute(this.element, 'cy'   , this.center.y.toString());
    this.renderer.setAttribute(this.element, 'r'    , this.radius);
    this.renderer.setAttribute(this.element, 'fill' , this.color);
  }
}
