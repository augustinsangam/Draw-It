import { Component } from '@angular/core';

import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { ColorService } from '../color.service';

@Component({
  selector: 'app-color-logic',
  templateUrl: './color-logic.component.html',
  styleUrls: ['./color-logic.component.scss']
})
export class ColorLogicComponent extends ToolLogicDirective {

  constructor(private readonly service: ColorService) {
    super();
  }

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit() {
    // tslint:disable-next-line no-unused-expression
    this.service; // TODO: Remove
  }
}
