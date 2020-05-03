import {
  Directive,
  Input,
  OnInit
} from '@angular/core';
import { SvgShape } from 'src/app/svg/svg-shape';
import { SVGStructure } from '../../svg/svg-structure';

@Directive({
  selector: 'app-tool-logic',
})
export abstract class ToolLogicDirective implements OnInit {

  @Input() svgStructure: SVGStructure;
  @Input() svgShape: SvgShape;
  readonly svgNS: string;

  protected constructor() {
    this.svgNS = 'http://www.w3.org/2000/svg';
  }

  abstract ngOnInit(): void;
}
