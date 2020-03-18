import {Component, ElementRef} from '@angular/core';
import {ToolPanelDirective} from '../../tool-panel/tool-panel.directive';
import {TextService} from '../text.service';

@Component({
  selector: 'app-text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss']
})
export class TextPanelComponent extends ToolPanelDirective {

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly service: TextService
  ) {
    super(elementRef);
  }

}
