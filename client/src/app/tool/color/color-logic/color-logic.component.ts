import { Component } from '@angular/core';
import { ToolLogicComponent } from '../../tool-logic/tool-logic.component';

@Component({
  selector: 'app-color-logic',
  templateUrl: './color-logic.component.html',
  styleUrls: ['./color-logic.component.scss']
})
export class ColorLogicComponent extends ToolLogicComponent {

  constructor() {
    super();
  }

}
