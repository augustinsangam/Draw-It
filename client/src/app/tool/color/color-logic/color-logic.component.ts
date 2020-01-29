import { Component } from '@angular/core';

import { ToolLogicComponent } from '../../tool-logic/tool-logic.component';
import { ColorService } from '../color.service';

@Component({
  selector: 'app-color-logic',
  templateUrl: './color-logic.component.html',
  styleUrls: ['./color-logic.component.scss']
})
export class ColorLogicComponent extends ToolLogicComponent {

  constructor(private readonly service: ColorService) {
    super();
  }

  ngOnInit() {
    console.log('From ColorLogicComponent');
    console.log(' - elementRef is');
    console.log(this.svgElRef);
    console.log(' - service is');
    console.log(this.service);
  }
}
