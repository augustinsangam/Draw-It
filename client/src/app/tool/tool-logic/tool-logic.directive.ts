import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: 'app-tool-logic',
})
export abstract class ToolLogicDirective implements OnInit {
  @Input() svgElRef: ElementRef<SVGElement>;
  protected readonly svgNS: string;

  constructor() {
    this.svgNS = 'http://www.w3.org/2000/svg';
  }

  // github.com/microsoft/TypeScript/issues/22815
  // svgElRef is NOT available from constructor, but rather from ngOnInit
  abstract ngOnInit(): void;
}
