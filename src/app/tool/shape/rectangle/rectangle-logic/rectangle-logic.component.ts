import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { UndoRedoService } from '../../../../undo-redo/undo-redo.service';
import { ColorService } from '../../../color/color.service';
import { MathService } from '../../../mathematics/tool.math-service.service';
import { ToolLogicDirective } from '../../../tool-logic/tool-logic.directive';
import {
  BackGroundProperties,
  StrokeProperties,
  Style
} from '../../common/abstract-shape';
import { Point } from '../../common/point';
import { Rectangle } from '../../common/rectangle';
import { RectangleService } from '../rectangle.service';

enum ClickType {
  LEFT_CLICK,
}
enum KEYBOARDTOUCH {
  SHIFTLEFT = 'ShiftLeft',
  SHIFTRIGHT = 'ShiftRight'
}
@Component({
  selector: 'app-rectangle-logic',
  template: ''
})

export class RectangleLogicComponent extends ToolLogicDirective
  implements OnDestroy, OnInit {

  private static readonly SEMIOPACITY: string = '0.5';
  private static readonly FULLOPACITY: string = '1';

  private rectangles: Rectangle[];
  private onDrag: boolean;
  private currentPoint: Point;
  private mouseDownPoint: Point;
  private style: Style;
  private allListeners: (() => void)[];

  constructor(
    private readonly service: RectangleService,
    private readonly renderer: Renderer2,
    private readonly colorService: ColorService,
    private readonly undoRedoService: UndoRedoService,
    private readonly mathService: MathService
  ) {
    super();
    this.onDrag = false;
    this.rectangles = [];
    this.allListeners = [];
    this.undoRedoService.resetActions();
    this.undoRedoService.setPreUndoAction({
      enabled: true,
      overrideDefaultBehaviour: true,
      overrideFunctionDefined: true,
      overrideFunction: () => {
        if (this.onDrag) {
          this.onMouseUp(new MouseEvent('mouseup', { button: 0 } as MouseEventInit));
          this.getRectangle().element.remove();
        }
        this.undoRedoService.undoBase();
      }
    });
  }

  ngOnInit(): void {
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
        mouseEv.preventDefault();
        if (!this.onDrag) {
          return;
        }
        this.currentPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
        this.viewTemporaryForm(mouseEv);
      }
    );

    const onMouseUp = this.renderer.listen(
      'document',
      'mouseup',
      (mouseEv: MouseEvent) => this.onMouseUp(mouseEv)
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

    this.allListeners = [onMouseDown, onKeyDown, onKeyUp, onMouseMove, onMouseUp];

    this.renderer.setStyle(this.svgStructure.root, 'cursor', 'crosshair');

  }

  private onKeyDown(keyEv: KeyboardEvent): void {
    if ((keyEv.code === KEYBOARDTOUCH.SHIFTLEFT || keyEv.code === KEYBOARDTOUCH.SHIFTRIGHT) && this.onDrag) {
      this.getRectangle().dragSquare(this.mouseDownPoint, this.currentPoint, this.service.thickness);
    }
  }

  private onKeyUp(keyEv: KeyboardEvent): void {
    if ((keyEv.code === KEYBOARDTOUCH.SHIFTLEFT || keyEv.code === KEYBOARDTOUCH.SHIFTRIGHT) && this.onDrag) {
      this.getRectangle().dragRectangle(this.mouseDownPoint, this.currentPoint, this.service.thickness);
    }
  }

  private onMouseUp(mouseEv: MouseEvent): void {
    if (mouseEv.button !== ClickType.LEFT_CLICK || !this.onDrag) {
      return ;
    }
    this.onDrag = false;
    this.style.opacity = RectangleLogicComponent.FULLOPACITY;
    this.getRectangle().setCss(this.style);
    this.undoRedoService.saveState();
    this.viewTemporaryForm(mouseEv);
  }

  private getRectangle(): Rectangle {
    return this.rectangles[this.rectangles.length - 1];
  }

  private initRectangle(mouseEv: MouseEvent): void {
    if (mouseEv.button !== ClickType.LEFT_CLICK) {
      return ;
    }
    const rectangle = this.renderer.createElement('rect', this.svgNS);
    this.renderer.appendChild(this.svgStructure.drawZone, rectangle);
    this.rectangles.push(new Rectangle(this.renderer, rectangle, this.mathService, this.service));
    this.setRectangleProperties();
    this.onDrag = true;
    this.mouseDownPoint = this.currentPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
  }

  private viewTemporaryForm(mouseEv: MouseEvent): void {
    if (mouseEv.shiftKey) {
      this.getRectangle().dragSquare(this.mouseDownPoint, this.currentPoint, this.service.thickness);
      return;
    }

    this.getRectangle().dragRectangle(this.mouseDownPoint, this.currentPoint, this.service.thickness);
  }

  private setRectangleProperties(): void {
    this.style = {
      strokeWidth: this.service.thickness.toString(),
      fillColor: this.colorService.primaryColor,
      strokeColor: this.colorService.secondaryColor,
      opacity: RectangleLogicComponent.SEMIOPACITY
    };
    this.getRectangle().setCss(this.style);

    const backgroundProperties = this.service.fillOption ?
      BackGroundProperties.FILLED :
      BackGroundProperties.NONE;

    const strokeProperties = this.service.borderOption ?
      StrokeProperties.FILLED :
      StrokeProperties.NONE;

    this.getRectangle().setParameters(
      backgroundProperties,
      strokeProperties
    );
  }

  ngOnDestroy(): void {
    this.allListeners.forEach((end) => end());
    this.undoRedoService.resetActions();
    if (this.onDrag) {
      this.onMouseUp(new MouseEvent('mouseup', { button: 0 } as MouseEventInit));
    }
  }
}
