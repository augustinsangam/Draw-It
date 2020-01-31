import { AfterViewInit, Component, Renderer2 } from '@angular/core';

import { ColorService } from '../../color/color.service';
import { PencilBrushCommon } from '../../pencil-brush/pencil-brush-common';
import { BrushService } from '../brush.service';

@Component({
  selector: 'app-brush-logic',
  templateUrl: './brush-logic.component.html',
  styleUrls: ['./brush-logic.component.scss']
})
export class BrushLogicComponent extends PencilBrushCommon implements AfterViewInit {

  currentX: number;
  currentY: number;
  strokeLineCap: string;
  stringPath: string;
  filter: string;
  private svgPath: SVGPathElement;
  private mouseOnHold: boolean;

  constructor(private readonly renderer: Renderer2,
              private colorService: ColorService,
              private brushService: BrushService) {
    super();
  }

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit() {
    this.currentX = 0;
    this.currentY = 0;
    this.stringPath = '';
    this.svgTag = 'path';
    this.strokeLineCap = 'round';
    this.filter = this.brushService.texture;
    this.mouseOnHold = false;
  }

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
    element.setAttribute('filter', `url(#${this.filter})`);
    element.setAttribute('stroke-linecap', this.strokeLineCap);
  }

  defineParameter(): void {
    this.color = this.colorService.primaryColor;
    this.stroke = this.colorService.primaryColor;
    this.fill = this.colorService.primaryColor;
    this.strokeWidth = this.brushService.thickness;
    this.filter = this.brushService.texture;
  }

  defineFilter(filter: string) {
    this.filter = filter;
  }

  onMouseDown(mouseEv: MouseEvent) {
    this.defineParameter();
    this.defineFilter(this.brushService.texture);
    this.makeFirstPoint(mouseEv);
    this.svgPath = this.renderer.createElement(this.svgTag, this.svgNS);
    this.configureSvgElement(this.svgPath);
    this.renderer.appendChild(this.svgElRef.nativeElement, this.svgPath);
    console.log(this.stringPath);
  }

  onMouseMove(mouseEv: MouseEvent) {
    this.drawing(mouseEv);
    this.svgPath.setAttribute('d', this.stringPath);
    console.log(this.stringPath);
  }

  ngAfterViewInit() {
    this.renderer.listen(this.svgElRef.nativeElement, 'mousedown', (mouseEv: MouseEvent) => {
      if (mouseEv.button === 0) {
        this.mouseOnHold = true;
        this.onMouseDown(mouseEv);
      }
    });

    this.renderer.listen(this.svgElRef.nativeElement, 'mousemove', (mouseEv: MouseEvent) => {
      if (mouseEv.button === 0 && this.mouseOnHold) {
        this.onMouseMove(mouseEv);
      }
    });

    this.renderer.listen(this.svgElRef.nativeElement, 'mouseup', (mouseEv: MouseEvent) => {
      this.mouseOnHold = false;
      this.stringPath = '';
    });

    this.renderer.listen(this.svgElRef.nativeElement, 'mouseleave', (mouseEv: MouseEvent) => {
      if (mouseEv.button === 0 && this.mouseOnHold) {
        this.mouseOnHold = false;
        this.stringPath = '';
      }
      console.log('mouse est out');
    });
  }

}
