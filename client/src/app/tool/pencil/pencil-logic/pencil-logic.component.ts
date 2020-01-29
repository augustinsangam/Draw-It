import { Component, Renderer2 } from '@angular/core';

import { ToolLogicComponent } from '../../tool-logic/tool-logic.component';
import { PencilService } from '../pencil.service';

@Component({
  selector: 'app-pencil-logic',
  templateUrl: './pencil-logic.component.html',
  styleUrls: ['./pencil-logic.component.scss']
})
export class PencilLogicComponent extends ToolLogicComponent {

  constructor(private readonly service: PencilService,
              private readonly renderer: Renderer2) {
    super();
  }

  ngOnInit() {
    console.log('From PencilLogicComponent');
    console.log(' - elementRef is');
    console.log(this.svgElRef);
    console.log(' - service is');
    console.log(this.service);
    const circle = this.renderer.createElement('svg:circle', this.svgNS);
    this.renderer.appendChild(this.svgElRef.nativeElement, circle);
  }
}
