import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { ColorService } from '../../../color/color.service';
import { MathService } from '../../../mathematics/tool.math-service.service';
import { ToolLogicDirective } from '../../../tool-logic/tool-logic.directive';
import { UndoRedoService} from '../../../undo-redo/undo-redo.service'
import { BackGroundProperties,
         StrokeProperties,
         Style } from '../../common/AbstractShape';
import { Point } from '../../common/Point';
import { Polygone} from '../../common/Polygone';
import { Rectangle} from '../../common/Rectangle';
import { PolygoneService } from '../polygone.service';
const SEMIOPACITY = '0.5';
const FULLOPACITY = '1';
enum ClickType {
  CLICKGAUCHE,
  CLICKDROIT
}
@Component({
  selector: 'app-polygone-logic',
  template: ''
})
export class PolygoneLogicComponent extends ToolLogicDirective
implements OnDestroy {
  private polygones: Polygone [];
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
    private readonly undoRedo: UndoRedoService
  ) {
    super();
    this.onDrag = false;
    this.allListeners = [];
    this.polygones = [];
    }
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {

    const onMouseDown = this.renderer.listen(
      this.svgElRef.nativeElement,
      'mousedown',
      (mouseEv: MouseEvent) => {
        this.initPolygone(mouseEv);
        this.initRectangle(mouseEv);
      }
    );

    const onMouseMove = this.renderer.listen(
      this.svgElRef.nativeElement,
      'mousemove',
      (mouseEv: MouseEvent) => {
        if (this.onDrag) {
          const currentPoint = { x: mouseEv.offsetX, y: mouseEv.offsetY };
          this.visualisationRectangle.dragRectangle(
            this.mouseDownPoint, currentPoint);

          this.getPolygone().drawPolygonFromRectangle(
            this.mouseDownPoint, currentPoint);
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
          this.getPolygone().setCss(this.style);
          this.visualisationRectangle.element.remove();
          this.undoRedo.addToCommands();
        }
      }
    );

    this.allListeners = [
      onMouseDown,
      onMouseMove,
      onMouseUp
    ];
  }

  ngOnDestroy() {
    this.allListeners.forEach(listenner => listenner());
  }

  private getPolygone(): Polygone {
    return this.polygones[this.polygones.length - 1];
  }

  private initPolygone(mouseEv: MouseEvent): void {
    if (mouseEv.button === ClickType.CLICKGAUCHE) {
      this.onDrag = true;
      this.mouseDownPoint = {x: mouseEv.offsetX, y: mouseEv.offsetY };

      const polygon = this.renderer.createElement('polygon', this.svgNS);
      this.renderer.appendChild(this.svgElRef.nativeElement, polygon);

      this.polygones.push(new Polygone(
        this.renderer,
        polygon,
        this.mathService, this.service.sides));
      }
    this.setPolygoneProperties();
  }

  private initRectangle(mouseEv: MouseEvent): void {
    if (mouseEv.button === ClickType.CLICKGAUCHE) {
    const rectangle = this.renderer.createElement('rect', this.svgNS);
    this.renderer.appendChild(this.svgElRef.nativeElement, rectangle);

    this.visualisationRectangle = new Rectangle(
      this.renderer,
      rectangle,
      this.mathService);

    this.visualisationRectangle.setParameters(
      BackGroundProperties.None, StrokeProperties.Dashed);
    }
  }

  private setPolygoneProperties() {
    this.style = {
      strokeWidth : this.service.thickness.toString(),
      fillColor : this.colorService.primaryColor,
      strokeColor : this.colorService.secondaryColor,
      opacity : SEMIOPACITY
    };
    this.getPolygone().setCss(this.style);

    const backgroundProperties = this.service.fillOption ?
    BackGroundProperties.Filled :
    BackGroundProperties.None;

    const strokeProperties = this.service.borderOption ?
    StrokeProperties.Filled :
    StrokeProperties.None;

    this.getPolygone().setParameters(
      backgroundProperties,
      strokeProperties);
  }
}
