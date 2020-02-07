import { ToolLogicDirective } from '../tool-logic/tool-logic.directive';

export abstract class PencilBrushCommon extends ToolLogicDirective {
    svgTag: string;
    color: string;
    stroke: string;
    strokeWidth: number;
    fill: string;
    stringPath: string;
    mouseOnHold: boolean;
    svgPath: SVGPathElement;

    constructor() {
        super();
    }

    abstract defineParameter(): void;
    abstract onMouseDown(mouseEv: MouseEvent): void;
    abstract configureSvgElement(element: SVGElement): void;
    drawing(mouseEv: MouseEvent): void {
        if (mouseEv.button === 0) {
          this.stringPath += ' L' + mouseEv.offsetX + ',' + mouseEv.offsetY;
          this.stringPath += ' M' + mouseEv.offsetX + ',' + mouseEv.offsetY;
        }
    }

    onMouseMove(mouseEv: MouseEvent) {
        this.drawing(mouseEv);
        this.svgPath.setAttribute('d', this.stringPath);
    }

    makeFirstPoint(mouseEv: MouseEvent) {
        if (mouseEv.button === 0) {
          this.stringPath = 'M' + mouseEv.offsetX + ',' + mouseEv.offsetY + ' h0';
        }
    }
}
