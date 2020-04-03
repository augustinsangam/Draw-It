import {Component, OnDestroy} from '@angular/core';
import {ToolLogicDirective} from '../../../tool-logic/tool-logic.directive';

@Component({
  selector: 'app-featherpen-logic',
  template: '',
})

// tslint:disable:use-lifecycle-interface
export class FeatherpenLogicComponent extends ToolLogicDirective
 implements OnDestroy {

  constructor() {
    super();
  }

  ngOnInit(): void {
    console.log('created !');
  }

  ngOnDestroy(): void {  }

}
