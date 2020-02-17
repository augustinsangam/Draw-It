import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import {ToolPanelDirective} from '../../tool-panel/tool-panel.directive';

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

  currentColor: string;

  constructor(elementRef: ElementRef<HTMLElement>,
              // private readonly service:
  ) {
    super(elementRef);
    this.currentColor = '#ffff00';
  }

  ngAfterViewChecked(): void {
    setTimeout(() =>
    this.currentColor = '#ffffff',
      1000
    )
  }

}
