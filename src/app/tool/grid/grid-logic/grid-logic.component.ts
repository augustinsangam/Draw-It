import {Component, OnInit, Renderer2} from '@angular/core';
import {ToolLogicDirective} from '../../tool-logic/tool-logic.directive';

@Component({
  selector: 'app-grid-logic',
  template: '',
})

export class GridLogicComponent extends ToolLogicDirective implements OnInit {

  constructor(private renderer: Renderer2) {
    super();
  }

  ngOnInit(): void {
    this.renderer.setStyle(this.svgStructure.root, 'cursor', 'auto');
  }

}
