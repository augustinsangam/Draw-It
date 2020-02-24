import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

import { UndoRedoAction } from '../constants/constants';
import { MathematicsService } from '../mathematics/mathematics.service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { ColorService } from './color/color.service';
import { ToolService } from './tool.service';

@Directive({
  selector: '[appTool]',
})
export class ToolDirective implements OnDestroy, OnInit {
  // This constructor guarantees the same prototype for all directives
  // This is why we disable tslint
  constructor(
    protected readonly elementRef: ElementRef<SVGSVGElement>,
    _colorService: ColorService,
    _mathService: MathematicsService,
    _renderer: Renderer2,
    _service: ToolService,
    protected readonly undoRedoService: UndoRedoService,
  ) {}

  ngOnDestroy(): void {
    console.warn('ngOnDestroy not implemented!');
  }

  ngOnInit(): void {
    console.warn('ngOnInit not implemented!');
  }

  // Create a snapshot for the SVG:G element
  protected save() {
    const drawZone = this.elementRef.nativeElement.getElementById('zone');
    this.undoRedoService.save(UndoRedoAction.SVG, drawZone.cloneNode(true));
  }
}
