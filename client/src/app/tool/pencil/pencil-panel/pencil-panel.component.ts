import { Component } from '@angular/core';

import { ToolPanelComponent } from '../../tool-panel/tool-panel.component';
import { PencilService } from '../pencil.service';

enum JonctionOptions {
  EnableJonction = 'AVEC',
  DisableJonction = 'SANS',
}

@Component({
  selector: 'app-pencil-panel',
  templateUrl: './pencil-panel.component.html',
  styleUrls: ['./pencil-panel.component.scss']
})
export class PencilPanelComponent extends ToolPanelComponent {

  jonctionOption  = JonctionOptions.EnableJonction;
  jonctionOptions = [JonctionOptions.EnableJonction, JonctionOptions.DisableJonction];

  constructor(private readonly service: PencilService) {
    super();
    console.log(this.service);
  }

}
