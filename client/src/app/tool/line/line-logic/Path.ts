import { ElementRef, Renderer2 } from '@angular/core';
import {Point} from '../../tool-common classes/Point'
import {Circle} from './Circle'
export class Path {
    svgNS = ' http://www.w3.org/2000/svg ';
    points: Point[] = [];
    jonctions: Circle[] = [];
    instructions: string[] = [];
    private pathString = '';
    lastPoint: Point;
    withJonctions: boolean;
    constructor( initialPoint: Point, private renderer: Renderer2, private element: ElementRef, withJonction: boolean ) {
      this.points.push(initialPoint);
      const instruction = 'M ' + initialPoint.x.toString() + ' ' + initialPoint.y.toString() + ' ';
      this.instructions.push(instruction);
      this.pathString += instruction;
      this.renderer.setAttribute(this.element, 'd', this.pathString);
      this.renderer.setAttribute(this.element, 'fill', 'none')
      this.withJonctions = withJonction;
    }
    addLine(point: Point) {
      this.points.push(point);
      const instruction = 'L ' + point.x.toString() + ' ' + point.y.toString() + ' ';
      this.instructions.push(instruction);
      this.pathString += instruction;
      this.renderer.setAttribute(this.element, 'd', this.pathString);
    }
    addJonction(element: ElementRef, point: Point, jonctionRadius: string) {
      this.jonctions.push(new Circle(point, this.renderer, element, jonctionRadius));
    }
    addTemporaryLine(point: Point) {
      const temp = this.pathString + 'L ' + point.x.toString() + ' ' + point.y.toString() + ' ';
      this.lastPoint = point;
      this.renderer.setAttribute(this.element, 'd', temp);
    }
    removeLastLine() {
      this.points.pop();
      this.pathString = this.pathString.substr(0, this.pathString.length - String(this.instructions.pop()).length );
      this.renderer.setAttribute(this.element, 'd', this.pathString );
      if (this.withJonctions && this.jonctions.length > 1) {
        this.removeLastJonction();
      }
    }
    removePath() {
      this.pathString = '';
      this.points = [];
      this.instructions = [];
      this.renderer.setAttribute(this.element, 'd', this.pathString);
      while (this.jonctions.length) {
        this.removeLastJonction()
      }
    }
    removeLastJonction() {
      const lastCircle = this.jonctions.pop();
      if (lastCircle !== undefined) {
        const lastJonction = lastCircle.element;
        this.renderer.removeChild(this.renderer.parentNode(lastJonction), lastJonction);
      }
    }
    closePath() {
      this.points.push(this.points[0]);
      const instruction = 'Z';
      this.instructions.push(instruction)
      this.pathString += instruction;
      this.renderer.setAttribute(this.element, 'd', this.pathString);
    }
    getAlignedPoint(point: Point): Point {
      const deltaX = point.x - this.points[this.points.length - 1].x
      const deltaY = point.y - this.points[this.points.length - 1].y
      const angle = Math.atan(deltaY / deltaX)
      if (Math.abs(angle) < Math.PI / 8) {
        return new Point(point.x, this.points[this.points.length - 1].y)
      }
      if (Math.abs(angle) > Math.PI * 3 / 8) {
        return new Point(this.points[this.points.length - 1].x, point.y)
      } else {
        if (deltaY * deltaX > 0) {
          return new Point(point.x, this.points[this.points.length - 1].y + deltaX)
        } else {
          return new Point(point.x, this.points[this.points.length - 1].y - deltaX)
        }
      }
    }
    setParameters(strokewidth: string, strokeColor: string) {
      this.renderer.setAttribute(this.element, 'stroke-width', strokewidth);
      this.renderer.setAttribute(this.element, 'stroke', strokeColor);
    }
  }
