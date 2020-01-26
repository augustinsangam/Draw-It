import { Component } from '@angular/core';

import { ToolComponent } from '../tool.component';

@Component({
  selector: 'app-pencil',
  templateUrl: './pencil.component.html',
  styleUrls: ['./pencil.component.scss']
})
export class PencilComponent extends ToolComponent {

  constructor() {
    super();
  }
}
