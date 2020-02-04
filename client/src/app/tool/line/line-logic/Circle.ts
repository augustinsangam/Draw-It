import { ElementRef, Renderer2 } from '@angular/core';
import {Point} from '../../tool-common classes/Point';
export class Circle {
    svgNS = ' http://www.w3.org/2000/svg ';
    strokeColor = 'black';
    circleRadius = '0';
    constructor(center: Point, private renderer: Renderer2, public element: ElementRef, circleRadius: string) {
      this.renderer.setAttribute(this.element, 'cx', center.x.toString());
      this.renderer.setAttribute(this.element, 'cy', center.y.toString());
      this.renderer.setAttribute(this.element, 'r', circleRadius);
    }
}
