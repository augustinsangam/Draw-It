
import { ToolLogicComponent } from '../tool-logic/tool-logic.component';

export abstract class PencilBrushCommon extends ToolLogicComponent {
    svgTag: string;
    color: string;
    stroke: string;
    strokeWidth: number;
    fill: string;

    constructor() {
        super();
    }

    abstract defineParameter(): void;
    abstract makeFirstPoint(mouseEv: MouseEvent): void;
    abstract drawing(mouseEv: MouseEvent): void;
    abstract onMouseMove(mouseEv: MouseEvent): void;
    abstract onMouseDown(mouseEv: MouseEvent): void;
    abstract configureSvgElement(element: SVGElement): void;

}
