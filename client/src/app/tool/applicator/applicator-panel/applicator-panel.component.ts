import { Component, ElementRef } from '@angular/core';
import { ColorService } from '../../color/color.service';
import { ToolPanelDirective } from '../../tool-panel/tool-panel.directive';

@Component({
  selector: 'app-applicator-panel',
  templateUrl: './applicator-panel.component.html',
  styleUrls: ['./applicator-panel.component.scss']
})
export class ApplicatorPanelComponent extends ToolPanelDirective {

  constructor(elementRef: ElementRef<HTMLElement>,
              protected colorService: ColorService) {
    super(elementRef);
  }

}
