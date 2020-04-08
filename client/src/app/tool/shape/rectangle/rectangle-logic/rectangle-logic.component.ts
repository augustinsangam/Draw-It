import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ColorService } from '../../../color/color.service';
import { MathService } from '../../../mathematics/tool.math-service.service';
import { ToolLogicDirective } from '../../../tool-logic/tool-logic.directive';
import { UndoRedoService } from '../../../../undo-redo/undo-redo.service';
import {
  BackGroundProperties,
  StrokeProperties,
  Style
} from '../../common/abstract-shape';
import { Point } from '../../common/point';
import { Rectangle } from '../../common/rectangle';
import { RectangleService } from '../rectangle.service';

const SEMIOPACITY = '0.5';
const FULLOPACITY = '1';

enum ClickType {
  CLICKGAUCHE,
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
        if (this.onDrag) {
          this.currentPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
          this.viewTemporaryForm(mouseEv);
        }
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
    if (mouseEv.button !== ClickType.CLICKGAUCHE || !this.onDrag) {
      return ;
    }
    this.onDrag = false;
    this.style.opacity = FULLOPACITY;
    this.getRectangle().setCss(this.style);
    this.undoRedoService.saveState();
    this.viewTemporaryForm(mouseEv);
  }

  private getRectangle(): Rectangle {
    return this.rectangles[this.rectangles.length - 1];
  }

  private initRectangle(mouseEv: MouseEvent): void {
    if (mouseEv.button !== ClickType.CLICKGAUCHE) {
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
    } else {
      this.getRectangle().dragRectangle(this.mouseDownPoint, this.currentPoint, this.service.thickness);
    }
  }

  private setRectangleProperties(): void {
    this.style = {
      strokeWidth: this.service.thickness.toString(),
      fillColor: this.colorService.primaryColor,
      strokeColor: this.colorService.secondaryColor,
      opacity: SEMIOPACITY
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
