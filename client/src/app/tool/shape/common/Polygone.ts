import { ElementRef, Renderer2 } from '@angular/core';
import { MathService } from '../../mathematics/tool.math-service.service';
import {AbstractShape} from './AbstractShape'
import { Point } from './Point';

// Class tested in ../Polygone/polygone-logic.component.spec.ts
export class Polygone extends AbstractShape {

  constructor(
    protected renderer: Renderer2,
    public element: SVGElement,
    private mathService: MathService,
    private svgElRef: ElementRef,
    private sides: number
  ) {
      super(renderer, element);
    }

  insertPolygonInSVG(points: Point []): void {
    let atribute = '';
    for (const point of points) {
      atribute += point.x.toString() + ',' + point.y.toString() + ' ';
    }
    this.renderer.setAttribute(this.element, 'points', atribute);
  }

  drawPolygonFromRectangle(mouseDownPoint: Point, oppositePoint: Point): void {
    const dimensions = this.mathService.getRectangleSize(
      mouseDownPoint,
      oppositePoint
    );
    const upLeftCorner = this.mathService.getRectangleUpLeftCorner(
      mouseDownPoint,
      oppositePoint
    );
    const points: Point [] = this.mathService.getPolynomeCornersFromRectangle(
      mouseDownPoint, upLeftCorner, dimensions, this.sides);

    this.insertPolygonInSVG(points);
    console.log(this.svgElRef);
    // const gravityCentre = this.mathService.getGravityCentre(points);
    // const minSquare = Math.min(dimensions.height, dimensions .width);
    // const deltaX = points[0].x - gravityCentre.x;
    // const deltaY = points[0].y - gravityCentre.y;
    // this.element.setAttribute('transform', `translate(${deltaX},${deltaY})`);
    // const boundingRect = this.element.getBoundingClientRect();
    // const maxForm = Math.max(boundingRect.height, boundingRect.width);
    // const coefK = minSquare / maxForm;
    // const coef = maxForm / minSquare;
    // this.element.setAttribute('transform', `scale(${coef},${coef})`);
    // this.element.setAttribute('transform', `scale(${2},${2})`);
     // const left = boundingRect.left - 44;
     // this.element.setAttribute(
     // `transform', `rotate(36, ${left + boundingRect.width /2 },
     // ${boundingRect.top + boundingRect.height /2})`)
  }

}
