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

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit() {
    this.service; // TODO: Remove
    const circle = this.renderer.createElement('svg:circle', this.svgNS);
    this.renderer.appendChild(this.svgElRef.nativeElement, circle);
  }
}
