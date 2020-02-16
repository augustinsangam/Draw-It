import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { ColorService } from '../../../color/color.service';
import { MathService } from '../../../mathematics/tool.math-service.service';
import { ToolLogicDirective } from '../../../tool-logic/tool-logic.directive';
import { BackGroundProperties,
         StrokeProperties,
         Style } from '../../common/AbstractShape';
import { Point } from '../../common/Point';
import {Rectangle} from '../../common/Rectangle';
import { RectangleService } from '../rectangle.service';

const SEMIOPACITY = '0.5'
const FULLOPACITY = '1'
enum ClickType {
  CLICKGAUCHE,
  CLICKDROIT
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
  private mouseDownPoint: Point;
  private style: Style;
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
        const validClick = mouseEv.button === ClickType.CLICKGAUCHE;
        if (validClick && this.onDrag ) {
          this.onDrag = false;

          this.style.opacity = FULLOPACITY;
          this.getRectangle().setCss(this.style);
          this.viewTemporaryForm(mouseEv);
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
        this.getRectangle().dragSquare(this.mouseDownPoint, this.currentPoint);
      }
    }
  }

  private onKeyUp(keyEv: KeyboardEvent): void {
    if (this.onDrag) {
      if (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight') {
        this.getRectangle().dragRectangle(
          this.mouseDownPoint, this.currentPoint);
      }
    }
  }

  private getRectangle(): Rectangle {
    return this.rectangles[this.currentRectangleIndex];
  }

  private initRectangle(mouseEv: MouseEvent): void {
    if (mouseEv.button === ClickType.CLICKGAUCHE) {
      const polynome = this.renderer.createElement('polynome', this.svgNS);
      this.renderer.appendChild(this.svgElRef.nativeElement, polynome);
      this.rectangles.push(new Rectangle(
        this.renderer,
        polynome,
        this.mathService
      ));
      this.setRectangleProperties();
      this.onDrag = true;
      this.mouseDownPoint = this.currentPoint = {
         x: mouseEv.offsetX, y: mouseEv.offsetY };
    }
  }

  private viewTemporaryForm(mouseEv: MouseEvent): void {
    mouseEv.shiftKey ?
      this.getRectangle().dragSquare(this. mouseDownPoint, this.currentPoint) :
      this.getRectangle().dragRectangle(
        this. mouseDownPoint, this.currentPoint);
    }

  private setRectangleProperties(): void {
    this.style = {
      strokeWidth : this.service.thickness.toString(),
      fillColor : this.colorService.primaryColor,
      strokeColor : this.colorService.secondaryColor,
      opacity : SEMIOPACITY
    };
    this.getRectangle().setCss(this.style);

    const backgroundProperties = this.service.fillOption ?
    BackGroundProperties.Filled :
    BackGroundProperties.None;

    const strokeProperties = this.service.borderOption ?
    StrokeProperties.Filled :
    StrokeProperties.None;

    this.getRectangle().setParameters(
      backgroundProperties,
      strokeProperties);
  }
}
