import { Component, Renderer2 } from '@angular/core';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';

@Component({
  selector: 'app-selection-logic',
  templateUrl: './selection-logic.component.html',
  styleUrls: ['./selection-logic.component.scss']
})
export class SelectionLogicComponent extends ToolLogicDirective {

  private selectedElements: Set<SVGElement>;

  private handlers = {
    click : ($event: MouseEvent) => {
      if ( $event.target !== this.svgElRef.nativeElement ) {
        this.selectedElements.clear();
        this.selectedElements.add($event.target as SVGElement);
        console.log(($event.target as SVGElement).getBoundingClientRect());
      } else {
        console.log('On désélecte tout !');
      }
    }
  }

  constructor( private renderer: Renderer2) {
    super();
    this.selectedElements = new Set();
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.renderer.setStyle(this.svgElRef.nativeElement, 'cursor', 'default');
    this.renderer.listen(this.svgElRef.nativeElement,
      'click', this.handlers.click);
  }

}
