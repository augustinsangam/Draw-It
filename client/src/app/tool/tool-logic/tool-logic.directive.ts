import {
  Directive,
  Input,
  OnInit
} from '@angular/core';
import { SVGStructure } from '../../svg/svg-structure';

@Directive({
  selector: 'app-tool-logic',
})
export abstract class ToolLogicDirective implements OnInit {

  @Input() svgStructure: SVGStructure;
  readonly svgNS: string;

  protected constructor() {
    this.svgNS = 'http://www.w3.org/2000/svg';
  }

  abstract ngOnInit(): void;
}
