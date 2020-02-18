import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
  } from '@angular/core';
import {ToolPanelDirective} from '../../tool-panel/tool-panel.directive';
import {PipetteService} from '../pipette.service';

@Component({
  selector: 'app-pipette-panel',
  templateUrl: './pipette-panel.component.html',
  styleUrls: ['./pipette-panel.component.scss']
})
export class PipettePanelComponent
  extends ToolPanelDirective implements AfterViewChecked {

  @ViewChild('pipetteSVG', {
    static: false,
  }) protected pipetteEl: ElementRef<HTMLElement>;

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly service: PipetteService
  ) {
    super(elementRef);
    this.service.currentColor = '#ffff00';
  }

  checkIfEasterEgg(): boolean {
    return this.service.currentColor === 'rgba(42,42,42,1)'
  }

  ngAfterViewChecked(): void {
  }

}
