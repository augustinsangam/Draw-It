import {Component, OnInit} from '@angular/core';
import {ToolLogicDirective} from '../../tool-logic/tool-logic.directive';

@Component({
  selector: 'app-grid-logic',
  template: '',
})

export class GridLogicComponent extends ToolLogicDirective implements OnInit {

  constructor() {
    super();
  }

  // TODO : RENDERER

  ngOnInit(): void {
    this.svgStructure.root.style.cursor = 'auto';
  }

}
