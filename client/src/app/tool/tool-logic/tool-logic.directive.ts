import {
  Directive,
  Input,
  OnInit,
  Inject,
} from '@angular/core';
import { UndoRedoService } from '../undo-redo/undo-redo.service';

export interface SVGStructure {
  root: SVGSVGElement,
  drawZone: SVGGElement,
  temporaryZone: SVGGElement,
  endZone: SVGGElement
}

@Directive({
  selector: 'app-tool-logic',
})
export abstract class ToolLogicDirective implements OnInit {

  @Input() svgStructure: SVGStructure;

  readonly svgNS: string;
  protected constructor() {
    this.svgNS = 'http://www.w3.org/2000/svg';
    console.log('ToolLogic');
  }

  // github.com/microsoft/TypeScript/issues/22815
  // svgElRef is NOT available from constructor, but rather from ngOnInit
  // Must be public
  abstract ngOnInit(): void;
}
