import { Component, Renderer2 } from '@angular/core';

import { ToolLogicComponent } from '../../tool-logic/tool-logic.component';
import { RectangleService } from '../rectangle.service';

@Component({
  selector: 'app-rectangle-logic',
  templateUrl: './rectangle-logic.component.html',
  styleUrls: ['./rectangle-logic.component.scss']
})
export class RectangleLogicComponent extends ToolLogicComponent {

  constructor(private readonly service: RectangleService,
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
