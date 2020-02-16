import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { ColorService } from '../../../color/color.service';
import { MathService } from '../../../mathematics/tool.math-service.service';
import { ToolLogicDirective } from '../../../tool-logic/tool-logic.directive';
import { BackGroundProperties,
         StrokeProperties,
         Style } from '../../common/AbstractShape';
import { Point } from '../../common/Point';
import {Polygone} from '../../common/Polygone';
import {Rectangle} from '../../common/Rectangle';
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
    private readonly mathService: MathService
  ) {
    super();
    this.onDrag = false;
    this.allListeners = [];
    this.polygones = [];

    const rectangle = this.renderer.createElement('rect', this.svgNS);
    this.renderer.appendChild(this.svgElRef.nativeElement, rectangle);

    this.visualisationRectangle = new Rectangle(
      this.renderer,
      rectangle,
      this.mathService);
    this.visualisationRectangle.setParameters(
      BackGroundProperties.None, StrokeProperties.Dashed);
    }
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    const onMouseDown = this.renderer.listen(
      this.svgElRef.nativeElement,
      'mousedown',
      (mouseEv: MouseEvent) => {
        this.initPolygone(mouseEv);
      }
    );

    const onMouseMove = this.renderer.listen(
      this.svgElRef.nativeElement,
      'mousemove',
      (mouseEv: MouseEvent) => {
        if (this.onDrag) {
          let currentPoint = { x: mouseEv.offsetX, y: mouseEv.offsetY };
          this.
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
          this.viewTemporaryForm(mouseEv);
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

  private getPolygone(): Rectangle {
    return this.polygones[this.polygones.length - 1];
  }

  private initPolygone(mouseEv: MouseEvent): void {
    if (mouseEv.button === ClickType.CLICKGAUCHE) {
      this.setPolygoneProperties();
      this.onDrag = true;
      this.mouseDownPoint = this.currentPoint = {
         x: mouseEv.offsetX, y: mouseEv.offsetY };
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
