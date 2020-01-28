import { Component } from '@angular/core';

import { ToolLogicComponent } from '../../tool-logic/tool-logic.component';
import { PencilService } from '../pencil.service';

@Component({
  selector: 'app-pencil-logic',
  templateUrl: './pencil-logic.component.html',
  styleUrls: ['./pencil-logic.component.scss']
})
export class PencilLogicComponent extends ToolLogicComponent {

  constructor(private readonly service: PencilService) {
    super();
  }
}
