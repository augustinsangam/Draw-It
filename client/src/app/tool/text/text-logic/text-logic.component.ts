import {Component, Renderer2} from '@angular/core';
import {ToolLogicDirective} from '../../tool-logic/tool-logic.directive';
import {TextService} from '../text.service';

@Component({
  selector: 'app-text-logic',
  template: '',
})

// tslint:disable:use-lifecycle-interface
export class TextLogicComponent extends ToolLogicDirective {

  constructor(private readonly service: TextService,
              private readonly renderer: Renderer2,
  ) {
    super();
  }

  ngOnInit(): void { console.log('das') }


}
