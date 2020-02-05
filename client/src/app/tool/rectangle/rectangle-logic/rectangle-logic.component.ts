import { Component, ElementRef, Renderer2, } from '@angular/core';

import { ColorService } from '../../color/color.service';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { RectangleService } from '../rectangle.service';

enum ClickType {
  CLICKGAUCHE = 0,
  CLICKDROIT = 1
};

@Component({
  selector: 'app-rectangle-logic',
  templateUrl: './rectangle-logic.component.html',
  styleUrls: ['./rectangle-logic.component.scss']
})
export class RectangleLogicComponent extends ToolLogicDirective {

  private rectangles: Rectangle[] = [];
  private currentRectangleIndex = -1;
  private onDrag = false;
  private currentPoint: Point;
  private allListeners: (() => void)[] = [];

  constructor(private readonly service: RectangleService,
              private readonly renderer: Renderer2,
              private readonly colorService: ColorService) {
    super();
  }

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit() {
    this.allListeners.push(
      this.renderer.listen(this.svgElRef.nativeElement, 'mousedown', (mouseEv: MouseEvent) => {
        this.initRectangle(mouseEv);
      }
      ));

    this.allListeners.push(
      this.renderer.listen(this.svgElRef.nativeElement, 'mousemove', (mouseEv: MouseEvent) => {
        if (this.onDrag) {
          this.currentPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
          this.viewTemporaryForm(mouseEv)
        }
      }
    ));

    this.allListeners.push(
      this.renderer.listen('document', 'mouseup', (mouseEv: MouseEvent) => {
        if (mouseEv.button === ClickType.CLICKGAUCHE && this.onDrag) {
          this.onDrag = false;
          this.viewTemporaryForm(mouseEv)
          this.getRectangle().setOpacity('1.0')
        }
      }
    ));

    this.allListeners.push(
      this.renderer.listen('document', 'keydown', (keyEv: KeyboardEvent) => {
        if (this.onDrag) {
          if (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight') {
            this.getRectangle().drawTemporarySquare(this.currentPoint)
          }
      }
    }
    ));

    this.allListeners.push(
      this.renderer.listen('document', 'keyup', (keyEv: KeyboardEvent) => {
        if (this.onDrag) {
          if (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight') {
            this.getRectangle().drawTemporaryRectangle(this.currentPoint)
          }
        }
      }
    ));
  }

  getRectangle(): Rectangle {
    return this.rectangles[this.currentRectangleIndex];
  }
  initRectangle(mouseEv: MouseEvent) {
    if (mouseEv.button === ClickType.CLICKGAUCHE) {
      this.currentPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
      const rectangle = this.renderer.createElement('rect', this.svgNS);
      this.renderer.appendChild(this.svgElRef.nativeElement, rectangle);
      this.rectangles[++this.currentRectangleIndex] = new Rectangle(this.currentPoint, this.renderer, rectangle);
      this.getRectangle().setParameters({
        borderWidth: (this.service.borderOption) ? this.service.thickness.toString() : '0',
        borderColor: this.colorService.secondaryColor,
        fillColor: this.colorService.primaryColor,
        filled: this.service.fillOption,
      });
      this.onDrag = true;
    }
  }
  viewTemporaryForm(mouseEv: MouseEvent) {
    if (mouseEv.shiftKey) {
      this.getRectangle().drawTemporarySquare(this.currentPoint)
    } else {
      this.getRectangle().drawTemporaryRectangle(this.currentPoint);
    }
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    this.allListeners.forEach(listenner => {
      listenner();
    });
  }

}

class Rectangle {
  svgNS = ' http://www.w3.org/2000/svg ';
  initialPoint: Point;
  styleAtr = ''
  filled = true
  constructor(initialPoint: Point, private renderer: Renderer2, private element: ElementRef) {
    this.initialPoint = initialPoint;
  }

  drawRectangle(upLeftCorner: Point, dimension: Dimension) {
    this.renderer.setAttribute(this.element, 'x', upLeftCorner.x.toString());
    this.renderer.setAttribute(this.element, 'y', upLeftCorner.y.toString());
    this.renderer.setAttribute(this.element, 'width', dimension.width.toString());
    this.renderer.setAttribute(this.element, 'height', dimension.height.toString());
  }
  getDimension(oppositePoint: Point): Dimension {
    const x = Math.abs(oppositePoint.x - this.initialPoint.x)
    const y = Math.abs(oppositePoint.y - this.initialPoint.y)
    return { height: y, width: x }
  }
  getUpLeftCornerPoint(oppositePoint: Point): Point {
    const deltaX = oppositePoint.x - this.initialPoint.x;
    const deltaY = oppositePoint.y - this.initialPoint.y;
    if (deltaX > 0 && deltaY < 0) {
      return new Point(this.initialPoint.x, this.initialPoint.y + deltaY);
    }
    if (deltaX < 0 && deltaY < 0) {
      return new Point(this.initialPoint.x + deltaX, this.initialPoint.y + deltaY);
    }
    if (deltaX < 0 && deltaY > 0) {
      return new Point(this.initialPoint.x + deltaX, this.initialPoint.y);
    } else {
      return this.initialPoint;
    }
  }
  drawTemporaryRectangle(oppositePoint: Point) {
    const dimensions = this.getDimension(oppositePoint);
    const transformedPoint = this.getUpLeftCornerPoint(oppositePoint)
    this.drawRectangle(transformedPoint, dimensions);
    this.setOpacity('0.55');
  }
  drawTemporarySquare(oppositePoint: Point) {
    let deltaX = oppositePoint.x - this.initialPoint.x;
    let deltaY = oppositePoint.y - this.initialPoint.y;
    const min = Math.min(Math.abs(deltaY), Math.abs(deltaX));
    if (min === Math.abs(deltaY)) {
      deltaX = Math.sign(deltaX) * min;
    } else {
      deltaY = Math.sign(deltaY) * min;
    }
    const transformedPoint = new Point(deltaX + this.initialPoint.x, deltaY + this.initialPoint.y)
    const test = this.getUpLeftCornerPoint(transformedPoint);
    this.drawRectangle(test, { width: min, height: min });
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

interface Dimension {
  width: number,
  height: number
}

interface Style {
  borderWidth: string,
  borderColor: string,
  fillColor: string,
  filled: boolean
}

class Point {
  x = 0;
  y = 0;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
