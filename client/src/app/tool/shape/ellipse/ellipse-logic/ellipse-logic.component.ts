import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Point } from 'src/app/tool/selection/point';
import { UndoRedoService } from 'src/app/tool/undo-redo/undo-redo.service';
import { ColorService } from '../../../color/color.service';
import { MathService } from '../../../mathematics/tool.math-service.service';
import { ToolLogicDirective } from '../../../tool-logic/tool-logic.directive';
import {
  BackGroundProperties,
  StrokeProperties, Style
} from '../../common/abstract-shape';
import { Ellipse } from '../../common/ellipse';
import { Rectangle } from '../../common/rectangle';
import { EllipseService } from '../ellipse.service';

const SEMIOPACITY = '0.5';
const FULLOPACITY = '1';
enum ClickType {
  CLICKGAUCHE = 0,
}

@Component({
  selector: 'app-ellipse-logic',
  template: ''
})

export class EllipseLogicComponent extends ToolLogicDirective
  implements OnInit, OnDestroy {

  private ellipses: Ellipse[] = [];
  private onDrag: boolean;
  private currentPoint: Point;
  private initialPoint: Point;
  private style: Style;
  private allListeners: (() => void)[] = [];
  private rectVisu: Rectangle;

  constructor(
    private readonly service: EllipseService,
    private readonly renderer: Renderer2,
    private readonly colorService: ColorService,
    private readonly mathService: MathService,
    private readonly undoRedoService: UndoRedoService
  ) {
    super();
    this.onDrag = false;
    this.undoRedoService.resetActions();
    this.undoRedoService.setPreUndoAction({
      enabled: true,
      overrideDefaultBehaviour: true,
      overrideFunctionDefined: true,
      overrideFunction: () => {
        if (this.onDrag) {
          this.onMouseUp(
            new MouseEvent('mouseup', { button: 0 } as MouseEventInit)
          );
          this.getEllipse().element.remove();
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
        this.initEllipse(mouseEv);
        this.initRectangleVisu(mouseEv);
      }
    );

    const onMouseUp = this.renderer.listen(
      this.svgStructure.root,
      'mouseup',
      (mouseEv: MouseEvent) => this.onMouseUp(mouseEv)
    );

    const onMouseMove = this.renderer.listen(
      this.svgStructure.root,
      'mousemove',
      (mouseEv: MouseEvent) => {
        if (this.onDrag) {
          this.currentPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
          this.viewTemporaryForm(mouseEv);
          this.rectVisu.dragRectangle(
            this.initialPoint, this.currentPoint
          );
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
      onMouseMove,
      onMouseUp,
      onKeyDown,
      onKeyUp
    ];

    this.svgStructure.root.style.cursor = 'crosshair';

  }

  private onKeyDown(keyEv: KeyboardEvent): void {
    if (this.onDrag) {
      if (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight') {
        this.getEllipse().simulateCircle(this.initialPoint, this.currentPoint);
      }
    }
  }

  private onKeyUp(keyEv: KeyboardEvent): void {
    if (this.onDrag) {
      if (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight') {
        this.getEllipse().simulateEllipse(this.initialPoint, this.currentPoint);
      }
    }
  }

  private onMouseUp(mouseEv: MouseEvent): void {
    if (mouseEv.button === ClickType.CLICKGAUCHE && this.onDrag) {
      this.onDrag = false;
      this.rectVisu.element.remove();
      this.style.opacity = FULLOPACITY;
      this.getEllipse().setCss(this.style);
      this.undoRedoService.saveState();
    }
  }

  private getEllipse(): Ellipse {
    return this.ellipses[this.ellipses.length - 1];
  }

  private initEllipse(mouseEv: MouseEvent): void {
    if (mouseEv.button === ClickType.CLICKGAUCHE) {
      this.currentPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
      const ellipse = this.renderer.createElement('ellipse', this.svgNS);
      this.renderer.appendChild(this.svgStructure.drawZone, ellipse);
      this.ellipses.push(new Ellipse(
        this.currentPoint,
        this.renderer,
        ellipse,
        this.mathService
      ));
      this.setEllipseProperties();
      this.onDrag = true;
      this.initialPoint = this.currentPoint
        = new Point( mouseEv.offsetX, mouseEv.offsetY);
    }
  }

  private initRectangleVisu(mouseEv: MouseEvent): void {
    if (mouseEv.button === ClickType.CLICKGAUCHE) {
      const rectangle = this.renderer.createElement('rect', this.svgNS);
      this.renderer.appendChild(this.svgStructure.temporaryZone, rectangle);

      this.rectVisu = new Rectangle(
        this.renderer,
        rectangle,
        this.mathService
      );

      this.rectVisu.setParameters(
        BackGroundProperties.None, StrokeProperties.Dashed
      );
    }
  }

  private viewTemporaryForm(mouseEv: MouseEvent): void {
    if (mouseEv.shiftKey) {
      this.getEllipse().simulateCircle(this.initialPoint, this.currentPoint);
    } else {
      this.getEllipse().simulateEllipse(this.initialPoint, this.currentPoint);
    }
  }

  private setEllipseProperties(): void {
    this.style = {
      strokeWidth : this.service.thickness.toString(),
      fillColor : this.colorService.primaryColor,
      strokeColor : this.colorService.secondaryColor,
      opacity : SEMIOPACITY
    };
    this.getEllipse().setCss(this.style);

    const backgroundProperties = this.service.fillOption ?
      BackGroundProperties.Filled :
      BackGroundProperties.None;

    const strokeProperties = this.service.borderOption ?
      StrokeProperties.Filled :
      StrokeProperties.None;

    this.getEllipse().setParameters(
      backgroundProperties,
      strokeProperties
    );
  }

  ngOnDestroy(): void {
    this.allListeners.forEach((end) => end());
    this.undoRedoService.resetActions();
    if (this.onDrag) {
      this.onMouseUp(
        new MouseEvent('mouseup', { button: 0 } as MouseEventInit)
      );
      this.getEllipse().element.remove();
    }
  }

}
