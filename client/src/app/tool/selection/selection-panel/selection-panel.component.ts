import { Component, ElementRef } from '@angular/core';
import { ToolPanelDirective } from '../../tool-panel/tool-panel.directive';

@Component({
  selector: 'app-selection-panel',
  templateUrl: './selection-panel.component.html',
  styleUrls: ['./selection-panel.component.scss']
})
export class SelectionPanelComponent extends ToolPanelDirective {

  constructor(elementRef: ElementRef<HTMLElement>) {
      super(elementRef);
  }

}
