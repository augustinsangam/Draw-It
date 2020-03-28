import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';

export abstract class PencilBrushCommon extends ToolLogicDirective {
  svgTag: string;
  stringPath: string;
  mouseOnHold: boolean;
  svgPath: SVGPathElement;
  strokeLineCap: string;

  constructor() {
    super();
    this.svgTag = 'path';
    this.stringPath = '';
    this.strokeLineCap = 'round';
    this.mouseOnHold = false;
  }

  protected abstract onMouseDown(mouseEv: MouseEvent): void;
  protected abstract onMouseMove(mouseEv: MouseEvent): void;
  protected abstract configureSvgElement(element: SVGElement): void;

  protected drawing(mouseEv: MouseEvent): void {
    if (mouseEv.button === 0) {
      this.stringPath += ` L${mouseEv.offsetX},${mouseEv.offsetY}`;
      this.stringPath += ` M${mouseEv.offsetX},${mouseEv.offsetY}`;
    }
  }

  protected makeFirstPoint(mouseEv: MouseEvent): void {
    if (mouseEv.button === 0) {
      this.stringPath = `M${mouseEv.offsetX}`;
      this.stringPath += `,${mouseEv.offsetY} h0`;
    }
  }

  protected stopDrawing(): void {
    this.mouseOnHold = false;
    this.stringPath = '';
  }
}
