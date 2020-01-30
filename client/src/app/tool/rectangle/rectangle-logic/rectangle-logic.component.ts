import { AfterViewInit, Component, Renderer2, ElementRef } from '@angular/core';

import { ToolLogicComponent } from '../../tool-logic/tool-logic.component';
import { RectangleService, FillOption } from '../rectangle.service';
import { ColorService } from '../../color/color.service';

enum ClickType {
  CLICKGAUCHE = 1,
  CLICKDROIT = 2
};

@Component({
  selector: 'app-rectangle-logic',
  templateUrl: './rectangle-logic.component.html',
  styleUrls: ['./rectangle-logic.component.scss']
})
export class RectangleLogicComponent extends ToolLogicComponent implements AfterViewInit {

  private rectangles: Rectangle[] = [];
  private currentRectangleIndex = -1;
  private onDrag = false;
  private lastTempPoint: Point;

  constructor(private readonly service: RectangleService,
              private readonly renderer: Renderer2,
              private readonly colorService: ColorService) {
    super();
  }

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit() {
    console.log('From PencilLogicComponent');
    console.log(' - elementRef is');
    console.log(this.svgElRef);
    console.log(' - service is');
    console.log(this.service);
    const circle = this.renderer.createElement('svg:circle', this.svgNS);
    this.renderer.appendChild(this.svgElRef.nativeElement, circle);
  }

  ngAfterViewInit() {
    this.renderer.listen(this.svgElRef.nativeElement, 'mousedown', (mouseEv: MouseEvent) => {
      if (mouseEv.which ===  ClickType.CLICKGAUCHE ) {
        this.lastTempPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
        const rectangle = this.renderer.createElement('rect', this.svgNS);
        this.renderer.appendChild(this.svgElRef.nativeElement, rectangle);
        this.rectangles[++this.currentRectangleIndex] = new Rectangle(this.lastTempPoint, this.renderer, rectangle);
        this.getRectangle().setParameters({
          borderWidth: this.service.thickness.toString(),
          borderColor: this.colorService.secondaryColor,
          fillColor: this.colorService.primaryColor,
          filled: (this.service.fillOption === FillOption.With),
          bordered: (this.service.thickness === 0)
        });
        this.onDrag = true;
      }
    }
    );

    this.renderer.listen(this.svgElRef.nativeElement, 'mousemove', (mouseEv: MouseEvent) => {
      if (this.onDrag) {
        this.lastTempPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
        if (mouseEv.shiftKey) {
          this.getRectangle().drawTemporarySquare(this.lastTempPoint)
        } else {
          this.getRectangle().drawTemporaryRectangle(this.lastTempPoint);
        }
      }
    });

    this.renderer.listen(this.svgElRef.nativeElement, 'mouseout', (mouseEv: MouseEvent) => {
      console.log(mouseEv.offsetX, mouseEv.offsetY)
    });

    this.renderer.listen(document, 'mouseup', (mouseEv: MouseEvent) => {
      if (mouseEv.which === ClickType.CLICKGAUCHE) {
        this.onDrag = false;
        if (mouseEv.shiftKey) {
          this.getRectangle().drawTemporarySquare(this.lastTempPoint)
        } else {
          this.getRectangle().drawTemporaryRectangle(this.lastTempPoint);
        }
      }
      this.getRectangle().setOpacity('1.0')
    }
    );
    this.renderer.listen('document', 'keydown', (keyEv: KeyboardEvent) => {
      if (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight') {
        this.getRectangle().drawTemporarySquare(this.lastTempPoint)
      }
    });
    this.renderer.listen('document', 'keyup', (keyEv: KeyboardEvent) => {
      if (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight') {
        this.getRectangle().drawTemporaryRectangle(this.lastTempPoint)
      }
    });
  }
  getRectangle(): Rectangle {
    return this.rectangles[this.currentRectangleIndex];
  }

}

class Rectangle {
  svgNS = ' http://www.w3.org/2000/svg ';
  initialPoint: Point;
  styleAtr = ''
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
    this.setOpacity('0.55')
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
    if (!style.filled) {
      this.renderer.setAttribute(this.element, 'fill-opacity', '0.0');
    }
    if (!style.bordered) {
      this.renderer.setAttribute(this.element, 'stroke-opacity', '0.0');
    }
  }
  setOpacity(opacityPourcent: string) {
    this.renderer.setAttribute(this.element, 'stroke-opacity', opacityPourcent);
    this.renderer.setAttribute(this.element, 'fill-opacity', opacityPourcent);
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
  filled: boolean,
  bordered: boolean
}

class Point {
  x = 0;
  y = 0;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
