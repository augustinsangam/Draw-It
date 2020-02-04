import { AfterViewInit, Component, Renderer2 } from '@angular/core';

import { ColorService } from '../../color/color.service';
import { PencilBrushCommon } from '../../pencil-brush/pencil-brush-common';
import { PencilService } from '../pencil.service';

@Component({
  selector: 'app-pencil-logic',
  templateUrl: './pencil-logic.component.html',
  styleUrls: ['./pencil-logic.component.scss']
})
export class PencilLogicComponent extends PencilBrushCommon implements AfterViewInit {

  currentX: number;
  currentY: number;
  strokeLineCap: string;
  stringPath: string;
  svgPath: SVGPathElement;
  private mouseOnHold: boolean;
  private listeners: (() => void)[] = [];

  constructor(public renderer: Renderer2,
              public colorService: ColorService,
              public pencilService: PencilService) {
    super();
  }

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit() {
    this.currentX = 0;
    this.currentY = 0;
    this.stringPath = '';
    this.svgTag = 'path';
    this.strokeLineCap = 'round';
    this.mouseOnHold = false;
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    this.listeners.forEach(listenner => {
      listenner();
    })}

  makeFirstPoint(mouseEv: MouseEvent) {
    if (mouseEv.button === 0) {
      this.currentX = mouseEv.offsetX;
      this.currentY = mouseEv.offsetY;
      this.stringPath = 'M' + this.currentX + ',' + this.currentY + ' h0';
    }
  }

  drawing(mouseEv: MouseEvent) {
    if (mouseEv.button === 0) {
      this.stringPath += ' L' + mouseEv.offsetX + ',' + mouseEv.offsetY;
      this.stringPath += ' M' + mouseEv.offsetX + ',' + mouseEv.offsetY;
    }
  }

  configureSvgElement(element: SVGElement): void {
    element.setAttribute('d', this.stringPath);
    element.setAttribute('stroke-width', this.strokeWidth.toString());
    element.setAttribute('stroke', this.stroke);
    element.setAttribute('fill', this.fill);
    element.setAttribute('stroke-linecap', this.strokeLineCap);
  }

  defineParameter(): void {
    this.color = this.colorService.primaryColor;
    this.stroke = this.colorService.primaryColor;
    this.fill = this.colorService.primaryColor;
    this.strokeWidth = this.pencilService.thickness;
  }

  onMouseDown(mouseEv: MouseEvent) {
    this.defineParameter();
    this.makeFirstPoint(mouseEv);
    this.svgPath = this.renderer.createElement('path', this.svgNS);
    this.configureSvgElement(this.svgPath);
    this.renderer.appendChild(this.svgElRef.nativeElement, this.svgPath);
  }

  onMouseMove(mouseEv: MouseEvent) {
    this.drawing(mouseEv);
    this.svgPath.setAttribute('d', this.stringPath);
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
        this.mouseOnHold = false;
        this.stringPath = '';
      });

    const mouseLeaveListen = this.renderer.listen(this.svgElRef.nativeElement,
      'mouseleave', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0 && this.mouseOnHold) {
          this.mouseOnHold = false;
          this.stringPath = '';
        }
    });
    this.listeners = [mouseDownListen, mouseMoveListen, mouseUpListen, mouseLeaveListen];
  }
}
