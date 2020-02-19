import {Component, OnDestroy, Renderer2} from '@angular/core';
import {ToolLogicDirective} from '../../../tool-logic/tool-logic.directive';
import {ColorService} from '../../../color/color.service';
import {AerosolService} from '../aerosol.service';

@Component({
  selector: 'app-aerosol-logic',
  templateUrl: './aerosol-logic.component.html',
  styleUrls: ['./aerosol-logic.component.scss']
})

// tslint:disable:use-lifecycle-interface
export class AerosolLogicComponent extends ToolLogicDirective
  implements OnDestroy {

  constructor(
    private readonly service: AerosolService,
    private readonly renderer: Renderer2,
    private readonly colorService: ColorService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
