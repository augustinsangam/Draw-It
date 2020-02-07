import { ElementRef, Renderer2 } from '@angular/core';
import { MathService} from '../../mathematicService/tool.math-service.service'
import { Point } from '../../tool-common classes/Point';
import { Dimension } from './Dimension';
import { Style } from './Style';

export class Rectangle {
    private initialPoint: Point;
    private styleAtr = ''
    private filled = true
    private mathService = new MathService ();
    constructor(initialPoint: Point, private renderer: Renderer2, private element: ElementRef) {
      this.initialPoint = initialPoint;
    }
    drawRectangle(upLeftCorner: Point, dimension: Dimension) {
      this.renderer.setAttribute(this.element, 'x', upLeftCorner.x.toString());
      this.renderer.setAttribute(this.element, 'y', upLeftCorner.y.toString());
      this.renderer.setAttribute(this.element, 'width', dimension.width.toString());
      this.renderer.setAttribute(this.element, 'height', dimension.height.toString());
    }

    drawTemporaryRectangle(oppositePoint: Point) {
      const dimensions = this.mathService.getRectangleSize(this.initialPoint, oppositePoint);
      const transformedPoint = this.mathService.getRectangleUpLeftCorner(this.initialPoint, oppositePoint);
      this.drawRectangle(transformedPoint, dimensions);
      this.setOpacity('0.55');
    }
    drawTemporarySquare(oppositePoint: Point) {
      const transformedPoint = this.mathService.transformRectangleToSquare(this.initialPoint, oppositePoint);
      const finalPoint = this.mathService.getRectangleUpLeftCorner(this.initialPoint, transformedPoint);
      const squareDimension = this.mathService.getRectangleSize(this.initialPoint, transformedPoint);
      this.drawRectangle(finalPoint, squareDimension);
      this.setOpacity('0.55')
    }
    setParameters(style: Style) {
      this.styleAtr = `fill:${style.fillColor}; stroke:${style.borderColor}; stroke-width:${style.borderWidth}`
      this.renderer.setAttribute(this.element, 'style', this.styleAtr);
      this.filled = style.filled;
    }
    setOpacity(opacityPourcent: string) {
      if (this.filled) {
        this.renderer.setAttribute(this.element, 'fill-opacity', opacityPourcent);
      } else {
        this.renderer.setAttribute(this.element, 'fill-opacity', '0.0');
      }
      this.renderer.setAttribute(this.element, 'stroke-opacity', opacityPourcent);
    }
  }
