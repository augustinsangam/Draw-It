import { Component } from '@angular/core';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';

@Component({
  selector: 'app-eraser-logic',
  templateUrl: './eraser-logic.component.html',
  styleUrls: ['./eraser-logic.component.scss']
})
export class EraserLogicComponent extends ToolLogicDirective {

  constructor() {
    super();
  }

  ngOnInit() {

  }

}
