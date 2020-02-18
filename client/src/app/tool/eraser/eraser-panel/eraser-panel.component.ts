import { Component, ElementRef } from '@angular/core';
import { ToolPanelDirective } from '../../tool-panel/tool-panel.directive';

@Component({
  selector: 'app-eraser-panel',
  templateUrl: './eraser-panel.component.html',
  styleUrls: ['./eraser-panel.component.scss']
})
export class EraserPanelComponent extends ToolPanelDirective {

  constructor(elementRef: ElementRef<HTMLElement>) {
    super(elementRef);
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {

  }

}
