import { ElementRef, Renderer2 } from '@angular/core';
import {Point} from '../../tool-common classes/Point';
export class Circle {
    constructor(private center: Point, private renderer: Renderer2, public element: ElementRef, private radius: string, color: string) {
      this.renderer.setAttribute(this.element, 'cx', center.x.toString());
      this.renderer.setAttribute(this.element, 'cy', center.y.toString());
      this.renderer.setAttribute(this.element, 'r', radius);
      this.renderer.setAttribute(this.element, 'fill', color);
    }
}
