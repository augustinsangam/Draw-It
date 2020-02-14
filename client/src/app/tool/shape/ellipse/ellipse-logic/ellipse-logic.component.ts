import { Component } from '@angular/core';
import {ToolLogicDirective} from '../../../tool-logic/tool-logic.directive';

@Component({
  selector: 'app-ellipse-logic',
  template: ''
})
export class EllipseLogicComponent extends ToolLogicDirective {

  constructor() {
    super();
  }

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit(): void {
  }

}
