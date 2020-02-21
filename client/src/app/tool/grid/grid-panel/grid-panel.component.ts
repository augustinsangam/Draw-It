import {Component, ElementRef} from '@angular/core';
import {ToolPanelDirective} from '../../tool-panel/tool-panel.directive';

@Component({
  selector: 'app-grid-panel',
  templateUrl: './grid-panel.component.html',
  styleUrls: ['./grid-panel.component.scss']
})
// tslint:disable:use-lifecycle-interface
export class GridPanelComponent extends ToolPanelDirective {

  constructor(
    elementRef: ElementRef<HTMLElement>
  ) {
    super(elementRef);
  }

  ngOnInit() {
  }

}
