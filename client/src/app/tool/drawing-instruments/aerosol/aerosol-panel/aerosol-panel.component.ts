import {AfterViewChecked, Component, ElementRef} from '@angular/core';
import {ColorService} from '../../../color/color.service';
import {ToolPanelDirective} from '../../../tool-panel/tool-panel.directive';
import {AerosolService} from '../aerosol.service';

@Component({
  selector: 'app-aerosol-panel',
  templateUrl: './aerosol-panel.component.html',
  styleUrls: ['./aerosol-panel.component.scss']
})
export class AerosolPanelComponent extends ToolPanelDirective
  implements AfterViewChecked {

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private readonly service: AerosolService,
    private readonly colorService: ColorService)
  {
    super(elementRef);
  }

  ngAfterViewChecked(): void { }

}
