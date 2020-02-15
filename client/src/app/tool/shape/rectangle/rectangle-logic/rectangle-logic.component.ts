import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { ColorService } from '../../../color/color.service';
import { MathService } from '../../../mathematics/tool.math-service.service';
import { ToolLogicDirective } from '../../../tool-logic/tool-logic.directive';
import { Point } from '../../common/Point';
import { Rectangle } from '../../common/Rectangle';
import { RectangleService } from '../rectangle.service';

enum ClickType {
  CLICKGAUCHE,
}

@Component({
  selector: 'app-rectangle-logic',
  template: ''
})

export class RectangleLogicComponent extends ToolLogicDirective
  implements OnDestroy {

  private rectangles: Rectangle[] = [];
  private currentRectangleIndex = -1;
  private onDrag = false;
  private currentPoint: Point;
  private allListeners: (() => void)[] = [];

  constructor(
    private readonly service: RectangleService,
    private readonly renderer: Renderer2,
    private readonly colorService: ColorService,
    private readonly mathService: MathService
  ) {
    super();
  }

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit() {
    const onMouseDown = this.renderer.listen(
      this.svgElRef.nativeElement,
      'mousedown',
      (mouseEv: MouseEvent) => {
        this.initRectangle(mouseEv);
      }
    );

    const onMouseMove = this.renderer.listen(
      this.svgElRef.nativeElement,
      'mousemove',
      (mouseEv: MouseEvent) => {
        if (this.onDrag) {
          this.currentPoint = { x: mouseEv.offsetX, y: mouseEv.offsetY };
          this.viewTemporaryForm(mouseEv);
        }
      }
    );

    const onMouseUp = this.renderer.listen(
      'document',
      'mouseup',
      (mouseEv: MouseEvent) => {
        if (mouseEv.button === ClickType.CLICKGAUCHE && this.onDrag) {
          this.onDrag = false;
          this.viewTemporaryForm(mouseEv);
          this.getRectangle().setOpacity('1.0');
        }
      }
    );

    const onKeyDown = this.renderer.listen(
      this.svgElRef.nativeElement,
      'keydown',
      (keyEv: KeyboardEvent) => this.onKeyDown(keyEv)
    );

    const onKeyUp = this.renderer.listen(
      this.svgElRef.nativeElement,
      'keyup',
      (keyEv: KeyboardEvent) => this.onKeyUp(keyEv)
    );

    this.allListeners = [
      onMouseDown,
      onKeyDown,
      onKeyUp,
      onMouseMove,
      onMouseUp
    ];
  }

  ngOnDestroy() {
    this.allListeners.forEach(listenner => listenner());
  }

  private onKeyDown(keyEv: KeyboardEvent): void {
    if (this.onDrag) {
      if (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight') {
        this.getRectangle().simulateSquare(this.currentPoint);
      }
    }
  }

  private onKeyUp(keyEv: KeyboardEvent): void {
    if (this.onDrag) {
      if (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight') {
        this.getRectangle().simulateRectangle(this.currentPoint);
      }
    }
  }

  private getRectangle(): Rectangle {
    return this.rectangles[this.currentRectangleIndex];
  }

  private initRectangle(mouseEv: MouseEvent): void {
    if (mouseEv.button === ClickType.CLICKGAUCHE) {
      this.currentPoint = { x: mouseEv.offsetX, y: mouseEv.offsetY };
      const rectangle = this.renderer.createElement('rect', this.svgNS);
      this.renderer.appendChild(this.svgElRef.nativeElement, rectangle);
      this.rectangles[++this.currentRectangleIndex] = new Rectangle(
        this.currentPoint,
        this.renderer,
        rectangle,
        this.mathService
      );
      this.getRectangle().setParameters({
        borderWidth: this.service.borderOption ?
          this.service.thickness.toString()
          : '0',
        borderColor: this.colorService.secondaryColor,
        fillColor: this.colorService.primaryColor,
        filled: this.service.fillOption
      });
      this.onDrag = true;
    }
  }

  private viewTemporaryForm(mouseEv: MouseEvent): void {
    if (mouseEv.shiftKey) {
      this.getRectangle().simulateSquare(this.currentPoint);
    } else {
      this.getRectangle().simulateRectangle(this.currentPoint);
    }
  }
}
