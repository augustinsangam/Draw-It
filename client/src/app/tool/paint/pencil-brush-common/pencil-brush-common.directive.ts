import { Directive } from '@angular/core';

import { ToolDirective } from '../../tool.directive';

@Directive({
  selector: '[appPencilBrushCommon]',
})
export abstract class PencilBrushCommonDirective extends ToolDirective {
  protected stringPath: string;
  protected mouseOnHold: boolean;
  protected strokeLineCap: string;
  protected svgPath: SVGPathElement;

  protected abstract onMouseDown(mouseEv: MouseEvent): void;
  protected abstract onMouseMove(mouseEv: MouseEvent): void;
  protected abstract configureSvgElement(element: SVGElement): void;

  protected drawing(mouseEv: MouseEvent): void {
    if (mouseEv.button === 0) {
      this.stringPath += ' L' + mouseEv.offsetX + ',' + mouseEv.offsetY;
      this.stringPath += ' M' + mouseEv.offsetX + ',' + mouseEv.offsetY;
    }
  }

  protected makeFirstPoint(mouseEv: MouseEvent): void {
    if (mouseEv.button === 0) {
      this.stringPath = 'M' + mouseEv.offsetX;
      this.stringPath += ',' + mouseEv.offsetY + ' h0';
    }
  }

  protected stopDrawing(): void {
    this.mouseOnHold = false;
    this.stringPath = '';
    this.save();
  }
}
