import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MatSlider,
  MatSlideToggle,
  MatSlideToggleChange
} from '@angular/material';

import { OverlayService } from 'src/app/overlay/overlay.service';
import { DocEnum } from 'src/app/overlay/pages/documentation/doc-enum';
import { ToolPanelDirective } from '../../../tool-panel/tool-panel.directive';
import { PolygoneService } from '../polygone.service';

@Component({
  selector: 'app-polygone-panel',
  templateUrl: './polygone-panel.component.html',
  styleUrls: ['./polygone-panel.component.scss']
})
export class PolygonePanelComponent
  extends ToolPanelDirective implements AfterViewChecked {

  @ViewChild('fillOptionRef', {
    static: false,
    read : MatSlideToggle
  }) protected fillOptionRef: MatSlideToggle;

  @ViewChild('borderOptionRef', {
    static: false,
    read : MatSlideToggle
  }) protected borderOptionRef: MatSlideToggle;

  @ViewChild('thicknessSlider', {
    static: false,
    read: MatSlider
  }) private thicknessSlider: MatSlider;

  @ViewChild('sidesSlider', {
    static: false,
    read: MatSlider
  }) private sidesSlider: MatSlider;

  private polygoneForm: FormGroup;

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly service: PolygoneService,
              private readonly formBuilder: FormBuilder,
              private overlay: OverlayService) {
    super(elementRef);
    this.polygoneForm = this.formBuilder.group({
      thicknessFormField: [this.service.thickness, []],
      borderOption: [this.service.borderOption, []],
      thicknessSlider: [this.service.thickness, []],
      fillOption: [this.service.fillOption, []],
      sides: [this.service.sides, []],
      sidesFormField: [this.service.sides, []],
    });
  }

  ngAfterViewChecked(): void {
    this.fillOptionRef.change.subscribe(($event: MatSlideToggleChange) => {
      this.service.fillOption = ($event.checked);
      if (!$event.checked) {
        this.borderOptionRef.disabled = true;
        this.polygoneForm.controls.borderOption.disable();
      } else {
        this.borderOptionRef.disabled = false;
        this.polygoneForm.controls.borderOption.enable();
      }
    });

    this.borderOptionRef.change.subscribe(($event: MatSlideToggleChange) => {
      this.service.borderOption = $event.checked;
      if (!$event.checked) {
        this.fillOptionRef.disabled = true;
        this.polygoneForm.controls.fillOption.disable();
      } else {
        this.fillOptionRef.disabled = false;
        this.polygoneForm.controls.fillOption.enable();
      }
    });
  }

  protected onThicknessChange(): void {
    this.polygoneForm.patchValue({
      thicknessFormField: this.thicknessSlider.value
    });
    this.service.thickness = this.thicknessSlider.value as number;
  }

  protected onSidesChange(): void {
    this.polygoneForm.patchValue({
      sidesFormField: this.sidesSlider.value
    });
    this.service.sides = this.sidesSlider.value as number;
  }

  protected showDocumentation(): void {
    this.overlay.openDocumentationDialog(false, DocEnum.POLYGONE);
  }
}
