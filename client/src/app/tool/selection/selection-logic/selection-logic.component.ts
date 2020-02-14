import { Component } from '@angular/core';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';

@Component({
  selector: 'app-selection-logic',
  templateUrl: './selection-logic.component.html',
  styleUrls: ['./selection-logic.component.scss']
})
export class SelectionLogicComponent extends ToolLogicDirective {

  constructor() {
    super();
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {

  }

}
