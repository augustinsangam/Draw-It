import {Component, ElementRef} from '@angular/core';
import {ColorService} from '../../../color/color.service';
import {ToolPanelDirective} from '../../../tool-panel/tool-panel.directive';
import {FeatherpenService} from '../featherpen.service';

@Component({
  selector: 'app-featherpen-panel',
  templateUrl: './featherpen-panel.component.html',
  styleUrls: ['./featherpen-panel.component.scss']
})
// tslint:disable:use-lifecycle-interface
export class FeatherpenPanelComponent extends ToolPanelDirective {

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly service: FeatherpenService,
              protected readonly colorService: ColorService) {
    super(elementRef);
  }

  ngOnInit(): void {
    console.log('created!');
  }

}
