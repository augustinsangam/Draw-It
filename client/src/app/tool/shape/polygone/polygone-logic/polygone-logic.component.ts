import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { ColorService } from '../../../color/color.service';
import { MathService } from '../../../mathematics/tool.math-service.service';
import { ToolLogicDirective } from '../../../tool-logic/tool-logic.directive';
import { BackGroundProperties,
         StrokeProperties,
         Style } from '../../common/AbstractShape';
import { Polygone} from '../../common/Polygone';
import { Rectangle} from '../../common/Rectangle';
import { PolygoneService } from '../polygone.service';
import { Point } from 'src/app/tool/selection/Point';

const SEMI_OPACITY = '0.5';
const FULL_OPACITY = '1';

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
  ) {
    super();
    this.onDrag = false;
    this.allListeners = [];
    this.polygones = [];
    }
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {

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
        if (this.onDrag) {
          const currentPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
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
          this.style.opacity = FULL_OPACITY;
          this.getPolygone().setCss(this.style);
          this.visualisationRectangle.element.remove();
        }
      }
    );

    this.allListeners = [
      onMouseDown,
      onMouseMove,
      onMouseUp
    ];

    this.svgStructure.root.style.cursor = 'crosshair';

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
      this.mouseDownPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);

      const polygon = this.renderer.createElement('polygon', this.svgNS);
      this.renderer.appendChild(this.svgStructure.drawZone, polygon);

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
    this.renderer.appendChild(this.svgStructure.drawZone, rectangle);

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
      opacity : SEMI_OPACITY
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
