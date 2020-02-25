import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

import { Mouse, Opacity, SVG_NS } from '../../../constants/constants';
import { MathematicsService } from '../../../mathematics/mathematics.service';
import { UndoRedoService } from '../../../undo-redo/undo-redo.service';
import { ColorService } from '../../color/color.service';
import { ToolDirective } from '../../tool.directive';
import {
  BackgroundProperties,
  StrokeProperties,
  Style,
} from '../common/abstract-shape';
import { Point } from '../common/point';
import { Rectangle } from '../common/rectangle';
import { RectangleService } from './rectangle.service';

@Directive({
  selector: '[appRectangle]',
})
export class RectangleDirective extends ToolDirective
  implements OnDestroy, OnInit {
  private onDrag: boolean;
  private rectangles: Rectangle[];

  // TODO: set as optinal
  private currentPoint: Point;
  private drawZone: SVGGElement;
  private mouseDownPoint: Point;
  private style: Style;
  private listeners?: (() => void)[] = [];

  constructor(
    elementRef: ElementRef<SVGSVGElement>,
    private readonly colorService: ColorService,
    private readonly mathService: MathematicsService,
    private readonly renderer: Renderer2,
    private readonly service: RectangleService,
    undoRedoService: UndoRedoService,
  ) {
    super(elementRef, colorService, mathService, renderer, service,
      undoRedoService);
    this.onDrag = false;
    this.rectangles = new Array();
  }

  ngOnDestroy() {
    this.listeners?.forEach((listenner) => listenner());
  }

  ngOnInit() {
    this.drawZone = this.elementRef.nativeElement
      .getElementById('zone') as SVGGElement;

    const onMouseDown = this.renderer.listen(
      this.elementRef.nativeElement,
      'mousedown',
      (mouseEv: MouseEvent) => {
        this.initRectangle(mouseEv);
      }
  );

    const onMouseMove = this.renderer.listen(
      this.elementRef.nativeElement,
      'mousemove',
      (mouseEv: MouseEvent) => {
        if (this.onDrag) {
          this.currentPoint = {
            x: mouseEv.offsetX,
            y: mouseEv.offsetY,
          };
          this.viewTemporaryForm(mouseEv);
        }
      }
    );

    // Must be ‘document’
    const onMouseUp = this.renderer.listen(
      'document',
      'mouseup',
      (mouseEv: MouseEvent) => {
        const validClick = mouseEv.button === Mouse.LEFT_BTN;
        if (validClick && this.onDrag ) {
          this.onDrag = false;
          this.style.opacity = Opacity.FULL.toString();
          this.getRectangle().setCss(this.style);
          this.viewTemporaryForm(mouseEv);
          this.save();
        }
      }
    );

    const onKeyDown = this.renderer.listen(
      this.elementRef.nativeElement,
      'keydown',
      (keyEv: KeyboardEvent) => this.onKeyDown(keyEv)
    );

    const onKeyUp = this.renderer.listen(
      this.elementRef.nativeElement,
      'keyup',
      (keyEv: KeyboardEvent) => this.onKeyUp(keyEv)
    );

    this.listeners = [
      onMouseDown,
      onKeyDown,
      onKeyUp,
      onMouseMove,
      onMouseUp,
    ];

    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'cursor',
      'crosshair'
    );
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
    return this.rectangles[this.rectangles.length - 1];
  }

  private initRectangle(mouseEv: MouseEvent): void {
    if (mouseEv.button === Mouse.LEFT_BTN) {
      const rectangle = this.renderer.createElement('rect', SVG_NS);
      this.renderer.appendChild(this.drawZone, rectangle);
      this.rectangles.push(new Rectangle(
        this.renderer,
        rectangle,
        this.mathService,
      ));
      this.setRectangleProperties();
      this.onDrag = true;
      this.mouseDownPoint = this.currentPoint = {
        x: mouseEv.offsetX,
        y: mouseEv.offsetY,
      };
    }
  }

  private viewTemporaryForm(mouseEv: MouseEvent): void {
    if (mouseEv.shiftKey) {
      this.getRectangle().dragSquare(this. mouseDownPoint, this.currentPoint);
    } else {
      this.getRectangle().dragRectangle(
        this. mouseDownPoint, this.currentPoint);
    }
  }

  private setRectangleProperties(): void {
    this.style = {
      fillColor: this.colorService.primaryColor,
      opacity: Opacity.SEMI.toString(),
      strokeColor: this.colorService.secondaryColor,
      strokeWidth: this.service.thickness.toString(),
    };
    this.getRectangle().setCss(this.style);

    const backgroundProperties = this.service.fillOption
      ? BackgroundProperties.Filled
      : BackgroundProperties.None;

    const strokeProperties = this.service.borderOption
      ? StrokeProperties.Filled
      : StrokeProperties.None;

    this.getRectangle().setParameters(backgroundProperties, strokeProperties);
  }
}
