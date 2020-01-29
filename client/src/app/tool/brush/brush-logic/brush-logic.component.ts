import { Component } from '@angular/core';

import { ToolLogicComponent } from '../../tool-logic/tool-logic.component';
import { BrushService } from '../brush.service';

@Component({
  selector: 'app-brush-logic',
  templateUrl: './brush-logic.component.html',
  styleUrls: ['./brush-logic.component.scss']
})
export class BrushLogicComponent extends ToolLogicComponent {

  constructor(private readonly service: BrushService) {
    super();
  }

  ngOnInit() {
    console.log('From BrushLogicComponent');
    console.log(' - elementRef is');
    console.log(this.svgElRef);
    console.log(' - service is');
    console.log(this.service);
  }
}
