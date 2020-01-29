import { Component } from '@angular/core';
import { ToolPanelComponent } from '../../tool-panel/tool-panel.component';

@Component({
  selector: 'app-color-panel',
  templateUrl: './color-panel.component.html',
  styleUrls: ['./color-panel.component.scss']
})
export class ColorPanelComponent extends ToolPanelComponent {

  constructor() {
    super();
  }

}
