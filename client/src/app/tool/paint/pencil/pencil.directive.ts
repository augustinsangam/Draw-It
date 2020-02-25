import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

import { Svg, SVG_NS } from '../../../constants/constants';
import { MathematicsService } from '../../../mathematics/mathematics.service';
import { UndoRedoService } from '../../../undo-redo/undo-redo.service';
import { ColorService } from '../../color/color.service';
import {
  PencilBrushCommonDirective
} from '../pencil-brush-common/pencil-brush-common.directive';
import { PencilService } from './pencil.service';

@Directive({
  selector: '[appPencil]',
})
export class PencilDirective extends PencilBrushCommonDirective
  implements OnDestroy, OnInit {

  private drawZone: SVGGElement;
  private listeners: (() => void)[];

  constructor(
    elementRef: ElementRef<SVGSVGElement>,
    private readonly colorService: ColorService,
    mathService: MathematicsService,
    private readonly renderer: Renderer2,
    private readonly service: PencilService,
    undoRedoService: UndoRedoService,
  ) {
    super(elementRef, colorService, mathService, renderer, service,
      undoRedoService);
    this.listeners = new Array();
    this.mouseOnHold = false;
    this.stringPath = '';
    this.strokeLineCap = 'round';

  }

  ngOnDestroy() {
    this.listeners.forEach((listenner) => listenner());
  }

  ngOnInit() {
    this.drawZone = this.elementRef.nativeElement
      .getElementById('zone') as SVGGElement;

    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'cursor',
      'crosshair'
    );
    const mouseDownListen = this.renderer.listen(this.elementRef.nativeElement,
      'mousedown', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0) {
          this.mouseOnHold = true;
          this.onMouseDown(mouseEv);
        }
    });

    const mouseMoveListen = this.renderer.listen(this.elementRef.nativeElement,
      'mousemove', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0 && this.mouseOnHold) {
          this.onMouseMove(mouseEv);
        }
    });

    const mouseUpListen = this.renderer.listen(this.elementRef.nativeElement,
      'mouseup', (mouseEv: MouseEvent) => {
        this.stopDrawing();
    });

    const mouseLeaveListen = this.renderer.listen(this.elementRef.nativeElement,
      'mouseleave', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0 && this.mouseOnHold) {
          this.stopDrawing();
        }
    });

    this.listeners = [
      mouseDownListen,
      mouseMoveListen,
      mouseUpListen,
      mouseLeaveListen,
    ];
  }

  protected onMouseMove(mouseEv: MouseEvent): void {
    this.drawing(mouseEv);
    this.svgPath.setAttribute('d', this.stringPath);
  }

  protected onMouseDown(mouseEv: MouseEvent): void {
    this.makeFirstPoint(mouseEv);
    this.svgPath = this.renderer.createElement(Svg.PATH, SVG_NS);
    this.configureSvgElement(this.svgPath);
    this.renderer.appendChild(this.drawZone, this.svgPath);
  }

  protected configureSvgElement(element: SVGElement): void {
    element.setAttribute('d', this.stringPath);
    element.setAttribute('stroke', this.colorService.primaryColor);
    element.setAttribute('fill', this.colorService.primaryColor);
    element.setAttribute('stroke-linecap', this.strokeLineCap);
    element.setAttribute(
      'stroke-width', this.service.thickness.toString()
    );
  }
}
