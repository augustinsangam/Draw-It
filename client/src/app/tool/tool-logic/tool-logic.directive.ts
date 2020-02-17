import {
  Directive,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';

@Directive({
  selector: 'app-tool-logic',
})
export abstract class ToolLogicDirective implements OnInit {
  // Must be public
  @Input() svgElRef: ElementRef<SVGSVGElement>;
  // must be public
  readonly svgNS: string;

  protected constructor() {
    this.svgNS = 'http://www.w3.org/2000/svg';
  }

  // github.com/microsoft/TypeScript/issues/22815
  // svgElRef is NOT available from constructor, but rather from ngOnInit
  // Must be public
  abstract ngOnInit(): void;
}
