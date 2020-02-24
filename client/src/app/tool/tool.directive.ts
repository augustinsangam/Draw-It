import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

import { MathematicsService } from '../mathematics/mathematics.service';
import { ColorService } from './color/color.service';
import { ToolService } from './tool.service';

export interface ToolDrawbox {
  zone: SVGGElement;
  temp: SVGGElement;
  end: SVGGElement;
}

@Directive({
  selector: '[appTool]',
})
export class ToolDirective implements OnDestroy, OnInit {
  // This constructor guarantees the same prototype for all directives
  // This is why we disable tslint
  constructor(
    _elementRef: ElementRef<SVGSVGElement>,
    _colorService: ColorService,
    _mathService: MathematicsService,
    _renderer: Renderer2,
    _service: ToolService,
  // tslint:disable-next-line: no-empty
  ) {}

  ngOnDestroy(): void {
    console.warn('ngOnDestroy not implemented!');
  }

  ngOnInit(): void {
    console.warn('ngOnInit not implemented!');
  }
}
