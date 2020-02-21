import { AfterViewInit, Component, Renderer2 } from '@angular/core';

import { ColorService } from '../../../color/color.service';
import { PencilBrushCommon } from '../../pencil-brush/pencil-brush-common';
import { PencilService } from '../pencil.service';

@Component({
  selector: 'app-pencil-logic',
  template: ''
})
export class PencilLogicComponent extends PencilBrushCommon
  implements AfterViewInit {

  private listeners: (() => void)[];

  constructor(public renderer: Renderer2,
              public colorService: ColorService,
              public pencilService: PencilService) {
    super();
    this.listeners = new Array();
  }

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit() {
    this.renderer.setStyle(
      this.svgElRef.nativeElement,
      'cursor',
      'crosshair'
    );
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    this.listeners.forEach(listenner => { listenner(); });
  }

  protected configureSvgElement(element: SVGElement): void {
    element.setAttribute('d', this.stringPath);
    element.setAttribute('stroke', this.colorService.primaryColor);
    element.setAttribute('fill', this.colorService.primaryColor);
    element.setAttribute('stroke-linecap', this.strokeLineCap);
    element.setAttribute(
      'stroke-width', this.pencilService.thickness.toString()
    );
  }

  protected onMouseMove(mouseEv: MouseEvent): void {
    this.drawing(mouseEv);
    this.svgPath.setAttribute('d', this.stringPath);
  }

  protected onMouseDown(mouseEv: MouseEvent): void {
    this.makeFirstPoint(mouseEv);
    this.svgPath = this.renderer.createElement(this.svgTag, this.svgNS);
    this.configureSvgElement(this.svgPath);
    this.renderer.appendChild(this.svgElRef.nativeElement, this.svgPath);
  }

  ngAfterViewInit() {
    const mouseDownListen = this.renderer.listen(this.svgElRef.nativeElement,
      'mousedown', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0) {
          this.mouseOnHold = true;
          this.onMouseDown(mouseEv);
        }
    });

    const mouseMoveListen = this.renderer.listen(this.svgElRef.nativeElement,
      'mousemove', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0 && this.mouseOnHold) {
          this.onMouseMove(mouseEv);
        }
    });

    const mouseUpListen = this.renderer.listen(this.svgElRef.nativeElement,
      'mouseup', (mouseEv: MouseEvent) => {
        this.stopDrawing();
    });

    const mouseLeaveListen = this.renderer.listen(this.svgElRef.nativeElement,
      'mouseleave', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0 && this.mouseOnHold) {
          this.stopDrawing();
        }
    });

    this.listeners = [mouseDownListen,
      mouseMoveListen,
      mouseUpListen,
      mouseLeaveListen
    ];
  }
}
