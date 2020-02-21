import {Component, OnDestroy} from '@angular/core';
import {ToolLogicDirective} from '../../tool-logic/tool-logic.directive';

@Component({
  selector: 'app-grid-logic',
  template: '',
})
// tslint:disable:use-lifecycle-interface
export class GridLogicComponent extends ToolLogicDirective
implements OnDestroy {

  constructor() {
    super();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

}
