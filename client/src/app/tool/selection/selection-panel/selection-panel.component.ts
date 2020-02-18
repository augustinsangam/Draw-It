import { Component, ElementRef } from '@angular/core';
import { ToolPanelDirective } from '../../tool-panel/tool-panel.directive';

@Component({
  selector: 'app-selection-panel',
  template: '',
})
export class SelectionPanelComponent extends ToolPanelDirective {

  constructor(elementRef: ElementRef<HTMLElement>) {
      super(elementRef);
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {

  }

}
