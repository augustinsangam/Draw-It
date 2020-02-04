import { ToolLogicComponent } from '../tool-logic/tool-logic.component';

export abstract class PencilBrushCommon extends ToolLogicComponent {
    svgTag: string;
    color: string;
    stroke: string;
    strokeWidth: number;
    fill: string;
    stringPath: string;
    mouseOnHold: boolean;

    constructor() {
        super();
    }

    abstract defineParameter(): void;
    abstract makeFirstPoint(mouseEv: MouseEvent): void;
    abstract onMouseMove(mouseEv: MouseEvent): void;
    abstract onMouseDown(mouseEv: MouseEvent): void;
    abstract configureSvgElement(element: SVGElement): void;
    drawing(mouseEv: MouseEvent): void {
        if (mouseEv.button === 0) {
          this.stringPath += ' L' + mouseEv.offsetX + ',' + mouseEv.offsetY;
          this.stringPath += ' M' + mouseEv.offsetX + ',' + mouseEv.offsetY;
        }
    }

}
