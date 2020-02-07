import { Component, Renderer2, } from '@angular/core';

import { ColorService } from '../../color/color.service';
import { Point } from '../../common/Point'
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { RectangleService } from '../rectangle.service';
import { Rectangle } from './Rectangle';

enum ClickType {
  CLICKGAUCHE = 0,
  CLICKDROIT = 1
};

@Component({
  selector: 'app-rectangle-logic',
  template: ''
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
    const onMouseDown = this.renderer.listen(this.svgElRef.nativeElement, 'mousedown', (mouseEv: MouseEvent) => {
      this.initRectangle(mouseEv);
    });

    const onMouseMove = this.renderer.listen(this.svgElRef.nativeElement, 'mousemove', (mouseEv: MouseEvent) => {
      if (this.onDrag) {
        this.currentPoint = {x: mouseEv.offsetX, y: mouseEv.offsetY};
        this.viewTemporaryForm(mouseEv)
      }
    }
    );

    const onMouseUp = this.renderer.listen('document', 'mouseup', (mouseEv: MouseEvent) => {
      if (mouseEv.button === ClickType.CLICKGAUCHE && this.onDrag) {
        this.onDrag = false;
        this.viewTemporaryForm(mouseEv)
        this.getRectangle().setOpacity('1.0')
      }
    }
    );

    const onKeyDown = this.renderer.listen('document', 'keydown',
      (keyEv: KeyboardEvent) => {
        this.onKeyDown(keyEv);
      });

    const onKeyUp = this.renderer.listen('document', 'keyup',
      (keyEv: KeyboardEvent) => {
        this.onKeyUp(keyEv);
    });

    this.allListeners = [onMouseDown, onKeyDown, onKeyUp, onMouseMove, onMouseUp]
  }

  private onKeyDown(keyEv: KeyboardEvent) {
    if (this.onDrag) {
       if (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight') {
         this.getRectangle().drawTemporarySquare(this.currentPoint)
       }
     }
  }

  private onKeyUp(keyEv: KeyboardEvent) {
    if (this.onDrag) {
      if (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight') {
        this.getRectangle().drawTemporaryRectangle(this.currentPoint)
      }
    }
  }

  private getRectangle(): Rectangle {
    return this.rectangles[this.currentRectangleIndex];
  }
  private initRectangle(mouseEv: MouseEvent) {
    if (mouseEv.button === ClickType.CLICKGAUCHE) {
      this.currentPoint = {x: mouseEv.offsetX, y: mouseEv.offsetY};
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
  private viewTemporaryForm(mouseEv: MouseEvent) {
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
