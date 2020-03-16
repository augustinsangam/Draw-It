import { Component, OnInit } from '@angular/core';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';

@Component({
  selector: 'app-paint-seal-logic',
  template: ''
})
export class PaintSealLogicComponent
  extends ToolLogicDirective implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
    return ;
  }

}
