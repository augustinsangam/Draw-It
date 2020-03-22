import {
  Component,
  ElementRef,
} from '@angular/core';
import { ToolPanelDirective } from '../../tool-panel/tool-panel.directive';
import {SelectionService} from '../selection.service';

@Component({
  selector: 'app-selection-panel',
  templateUrl: './selection-panel.component.html',
  styleUrls: ['./selection-panel.component.scss']
})
export class SelectionPanelComponent extends ToolPanelDirective {

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly service: SelectionService) {
    super(elementRef);
  }
  onClick(): void {
    this.service.onCopy();
  }
}
