import {
  Component,
  ElementRef,
  ViewChild,
  } from '@angular/core';
import { OverlayService } from 'src/app/overlay/overlay.service';
import { DocEnum } from 'src/app/overlay/pages/documentation/doc-enum';
import {ColorService} from '../../color/color.service';
import {ToolPanelDirective} from '../../tool-panel/tool-panel.directive';
import {PipetteService} from '../pipette.service';

@Component({
  selector: 'app-pipette-panel',
  templateUrl: './pipette-panel.component.html',
  styleUrls: ['./pipette-panel.component.scss']
})
export class PipettePanelComponent
  extends ToolPanelDirective {

  @ViewChild('pipetteSVG', {
    static: false,
  }) protected pipetteEl: ElementRef<HTMLElement>;

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly pipService: PipetteService,
              private readonly colorService: ColorService,
              private overlay: OverlayService
  ) {
    super(elementRef);
    this.pipService.currentColor = 'rgba(0,0,0,0)';
  }

  protected getHex(): string {
    return this.colorService.hexFormRgba(this.pipService.currentColor);
  }

  protected showDocumentation(): void {
    this.overlay.openDocumentationDialog(false, DocEnum.pipette);
  }
}
