import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Point } from 'src/app/tool/shape/common/point';
import { ColorService } from '../../../color/color.service';
import { MathService } from '../../../mathematics/tool.math-service.service';
import { ToolLogicDirective } from '../../../tool-logic/tool-logic.directive';
import { UndoRedoService } from '../../../undo-redo/undo-redo.service';
import {
  BackGroundProperties,
  StrokeProperties,
  Style
} from '../../common/abstract-shape';
import { Polygone } from '../../common/polygone';
import { Rectangle } from '../../common/rectangle';
import { PolygoneService } from '../polygone.service';

const SEMI_OPACITY = '0.5';
const FULL_OPACITY = '1';

enum ClickType {
  CLICKGAUCHE,
}

@Component({
  selector: 'app-polygone-logic',
  template: ''
})
export class PolygoneLogicComponent extends ToolLogicDirective
  implements OnDestroy, OnInit {
  private polygones: Polygone[];
  private mouseDownPoint: Point;
  private onDrag: boolean;
  private style: Style;
  private visualisationRectangle: Rectangle;
  private allListeners: (() => void)[];

  constructor(
    private readonly service: PolygoneService,
    private readonly renderer: Renderer2,
    private readonly colorService: ColorService,
    private readonly mathService: MathService,
    private readonly undoRedoService: UndoRedoService
  ) {
    super();
    this.onDrag = false;
    this.allListeners = [];
    this.polygones = [];
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
          this.getPolygone().element.remove();
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
        this.initPolygone(mouseEv);
        this.initRectangle(mouseEv);
      }
    );

    const onMouseMove = this.renderer.listen(
      this.svgStructure.root,
      'mousemove',
      (mouseEv: MouseEvent) => {
        mouseEv.preventDefault();
        if (this.onDrag) {
          const currentPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
          this.visualisationRectangle.dragRectangle(
            this.mouseDownPoint, currentPoint);
          this.getPolygone().drawPolygonFromRectangle(
            this.mouseDownPoint, currentPoint, this.service.thickness);
        }
      }
    );

    const onMouseUp = this.renderer.listen(
      'document',
      'mouseup',
      (mouseEv: MouseEvent) => this.onMouseUp(mouseEv)
    );

    this.allListeners = [
      onMouseDown,
      onMouseMove,
      onMouseUp
    ];

    this.renderer.setStyle(this.svgStructure.root, 'cursor', 'crosshair');

  }

  ngOnDestroy(): void {
    this.allListeners.forEach((end) => end());
    this.undoRedoService.resetActions();
  }

  private getPolygone(): Polygone {
    return this.polygones[this.polygones.length - 1];
  }

  private onMouseUp(mouseEv: MouseEvent): void {
    const validClick = mouseEv.button === ClickType.CLICKGAUCHE;
    if (validClick && this.onDrag) {
      this.onDrag = false;
      this.style.opacity = FULL_OPACITY;
      this.getPolygone().setCss(this.style);
      this.visualisationRectangle.element.remove();
      this.undoRedoService.saveState();
    }
  }

  private initPolygone(mouseEv: MouseEvent): void {
    if (mouseEv.button === ClickType.CLICKGAUCHE) {
      this.onDrag = true;
      this.mouseDownPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);

      const polygon = this.renderer.createElement('polygon', this.svgNS);
      this.renderer.appendChild(this.svgStructure.drawZone, polygon);

      this.polygones.push(new Polygone(
        this.renderer,
        polygon,
        this.mathService, this.service.sides,
        this.service));
      this.setPolygoneProperties();
    }
  }

  private initRectangle(mouseEv: MouseEvent): void {
    if (mouseEv.button === ClickType.CLICKGAUCHE) {
      const rectangle = this.renderer.createElement('rect', this.svgNS);
      this.renderer.appendChild(this.svgStructure.drawZone, rectangle);

      this.visualisationRectangle = new Rectangle(
        this.renderer,
        rectangle,
        this.mathService
      );

      this.visualisationRectangle.setParameters(
        BackGroundProperties.None, StrokeProperties.Dashed
      );
    }
  }

  private setPolygoneProperties(): void {
    this.style = {
      strokeWidth: this.service.thickness.toString(),
      fillColor: this.colorService.primaryColor,
      strokeColor: this.colorService.secondaryColor,
      opacity: SEMI_OPACITY
    };
    this.getPolygone().setCss(this.style);

    const backgroundProperties = this.service.fillOption ?
      BackGroundProperties.Filled :
      BackGroundProperties.None;

    const strokeProperties = this.service.borderOption ?
      StrokeProperties.Filled : StrokeProperties.None;

    this.getPolygone().setParameters(backgroundProperties, strokeProperties);
  }
}
