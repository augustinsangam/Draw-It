import { ToolLogicDirective } from '../tool-logic/tool-logic.directive';

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

    abstract onMouseDown(mouseEv: MouseEvent): void;
    abstract configureSvgElement(element: SVGElement): void;
    abstract onMouseMove(mouseEv: MouseEvent): void;
    drawing(mouseEv: MouseEvent): void {
        if (mouseEv.button === 0) {
          this.stringPath += ' L' + mouseEv.offsetX + ',' + mouseEv.offsetY;
          this.stringPath += ' M' + mouseEv.offsetX + ',' + mouseEv.offsetY;
        }
    }

    makeFirstPoint(mouseEv: MouseEvent): void {
        if (mouseEv.button === 0) {
          this.stringPath = 'M' + mouseEv.offsetX ;
          this.stringPath += ',' + mouseEv.offsetY + ' h0';
        }
    }
}
