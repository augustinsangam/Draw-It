import { Component, Renderer2 } from '@angular/core';

import { PencilService } from '../../pencil/pencil.service';
import { ToolLogicComponent } from '../../tool-logic/tool-logic.component';

@Component({
  selector: 'app-line-logic',
  templateUrl: './line-logic.component.html',
  styleUrls: ['./line-logic.component.scss']
})
export class LineLogicComponent extends ToolLogicComponent {

  constructor(private readonly service: PencilService,
              private readonly renderer: Renderer2) {
    super();
  }

  // tslint:disable-next-line use-lifecycle-interface
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