import { Component } from '@angular/core';

import { ToolPanelComponent } from '../../tool-panel/tool-panel.component';
import { BrushService } from '../brush.service';

@Component({
  selector: 'app-brush-panel',
  templateUrl: './brush-panel.component.html',
  styleUrls: ['./brush-panel.component.scss']
})
export class BrushPanelComponent extends ToolPanelComponent {

  constructor(private readonly service: BrushService) {
    super();
    console.log(this.service);
  }
}
