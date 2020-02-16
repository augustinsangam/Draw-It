import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { ColorService } from '../../../color/color.service';
import { MathService } from '../../../mathematics/tool.math-service.service';
import { ToolLogicDirective } from '../../../tool-logic/tool-logic.directive';
import { Point } from '../../common/Point';
import {Polygone} from '../../common/Polygone'
import {Rectangle} from '../../common/Rectangle'
import { PolygoneService } from '../polygone.service';

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
  private currentPolygoneIndex;
  private onDrag;
  private currentPoint: Point;
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
    this.currentPolygoneIndex = -1;
    this.polygones = [];

    const rectangle = this.renderer.createElement('rect', this.svgNS);
    this.renderer.appendChild(this.svgElRef.nativeElement, rectangle);

    this.visualisationRectangle = new Rectangle(
      this.renderer,
      rectangle,
      this.mathService
    );
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
          this.currentPoint = { x: mouseEv.offsetX, y: mouseEv.offsetY };
          this.viewTemporaryForm();
        }
      }
    );

    const onMouseUp = this.renderer.listen(
      'document',
      'mouseup',
      (mouseEv: MouseEvent) => {
        if (mouseEv.button === ClickType.CLICKGAUCHE && this.onDrag) {
          this.onDrag = false;
          this.viewTemporaryForm();
          this.getPolygone().setOpacity('1.0');
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
    return this.polygones[this.currentPolygoneIndex];
  }

  private initPolygone(mouseEv: MouseEvent): void {
    if (mouseEv.button === ClickType.CLICKGAUCHE) {

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

      this.onDrag = true;
      this.mouseDownPoint = this.currentPoint = {
         x: mouseEv.offsetX, y: mouseEv.offsetY };
    }
  }

  private viewTemporaryForm(): void {
    this.visualisationRectangle.simulateRectangle(this.currentPoint);
  }

}
