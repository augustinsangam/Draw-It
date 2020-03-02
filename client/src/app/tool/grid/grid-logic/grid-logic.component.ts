import {Component, OnInit} from '@angular/core';
import {ToolLogicDirective} from '../../tool-logic/tool-logic.directive';

@Component({
  selector: 'app-grid-logic',
  template: '',
})

export class GridLogicComponent extends ToolLogicDirective implements OnInit {

  constructor(
  ) {
    super();
  }

  // TODO : Trouver un truc à mettre pour eviter que LINT chiale
  ngOnInit(): void { }

}
