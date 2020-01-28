import { Component } from '@angular/core';

import { ToolPanelComponent } from '../../tool-panel/tool-panel.component';
import { PencilService } from '../pencil.service';

@Component({
  selector: 'app-pencil-panel',
  templateUrl: './pencil-panel.component.html',
  styleUrls: ['./pencil-panel.component.scss']
})
export class PencilPanelComponent extends ToolPanelComponent {

  constructor(private readonly service: PencilService) {
    super();
  }
}
