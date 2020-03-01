import { Component, ElementRef, OnInit } from '@angular/core';
import { ToolPanelDirective } from '../../tool-panel/tool-panel.directive';

@Component({
  selector: 'app-selection-panel',
  templateUrl: './selection-panel.component.html',
  styleUrls: ['./selection-panel.component.scss']
})
export class SelectionPanelComponent extends ToolPanelDirective
  implements OnInit {

  constructor(elementRef: ElementRef<HTMLElement>) {
      super(elementRef);
  }

  ngOnInit(): void { }

}
