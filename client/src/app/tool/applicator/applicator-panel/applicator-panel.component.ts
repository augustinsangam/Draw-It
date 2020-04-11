import { Component, ElementRef } from '@angular/core';
import { OverlayService } from 'src/app/overlay/overlay.service';
import { DocEnum } from 'src/app/overlay/pages/documentation/doc-enum';
import { ColorService } from '../../color/color.service';
import { ToolPanelDirective } from '../../tool-panel/tool-panel.directive';

@Component({
  selector: 'app-applicator-panel',
  templateUrl: './applicator-panel.component.html',
  styleUrls: ['./applicator-panel.component.scss']
})
export class ApplicatorPanelComponent extends ToolPanelDirective {

  constructor(elementRef: ElementRef<HTMLElement>,
              protected colorService: ColorService,
              private overlay: OverlayService) {
    super(elementRef);
  }

  protected showDocumentation(): void {
   this.overlay.openDocumentationDialog(false, DocEnum.applicator);
  }

}
