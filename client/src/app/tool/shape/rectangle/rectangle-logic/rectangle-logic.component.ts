import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { Point } from 'src/app/tool/selection/Point';
import { UndoRedoService } from 'src/app/tool/undo-redo/undo-redo.service';
import { ColorService } from '../../../color/color.service';
import { MathService } from '../../../mathematics/tool.math-service.service';
import { ToolLogicDirective } from '../../../tool-logic/tool-logic.directive';
import {
  BackGroundProperties,
  StrokeProperties,
  Style
} from '../../common/AbstractShape';
import { Rectangle } from '../../common/Rectangle';
import { RectangleService } from '../rectangle.service';

const SEMIOPACITY = '0.5';
const FULLOPACITY = '1';
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
  private onDrag = false;
  private currentPoint: Point;
  private mouseDownPoint: Point;
  private style: Style;
  private allListeners: (() => void)[] = [];

  constructor(
    private readonly service: RectangleService,
    private readonly renderer: Renderer2,
    private readonly colorService: ColorService,
    private readonly undoRedo: UndoRedoService,
    private readonly mathService: MathService
  ) {
    super();
  }

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit() {
    const onMouseDown = this.renderer.listen(
      this.svgStructure.root,
      'mousedown',
      (mouseEv: MouseEvent) => {
        this.initRectangle(mouseEv);
      }
  );

    const onMouseMove = this.renderer.listen(
      this.svgStructure.root,
      'mousemove',
      (mouseEv: MouseEvent) => {
        if (this.onDrag) {
          this.currentPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
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
          this.undoRedo.addToCommands();
          }
      }
    );

    const onKeyDown = this.renderer.listen(
      this.svgStructure.root,
      'keydown',
      (keyEv: KeyboardEvent) => this.onKeyDown(keyEv)
    );

    const onKeyUp = this.renderer.listen(
      this.svgStructure.root,
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

    this.svgStructure.root.style.cursor = 'crosshair';

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
    return this.rectangles[this.rectangles.length - 1];
  }

  private initRectangle(mouseEv: MouseEvent): void {
    if (mouseEv.button === ClickType.CLICKGAUCHE) {
      const rectangle = this.renderer.createElement('rect', this.svgNS);
      this.renderer.appendChild(this.svgStructure.drawZone, rectangle);
      this.rectangles.push(new Rectangle(
        this.renderer,
        rectangle,
        this.mathService
      ));
      this.setRectangleProperties();
      this.onDrag = true;
      this.mouseDownPoint = this.currentPoint
        = new Point(mouseEv.offsetX, mouseEv.offsetY );
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
