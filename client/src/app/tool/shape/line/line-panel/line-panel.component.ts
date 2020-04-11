import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlider, MatSlideToggleChange } from '@angular/material';
import { MatSlideToggle } from '@angular/material/slide-toggle';

import { OverlayService } from 'src/app/overlay/overlay.service';
import { DocEnum } from 'src/app/overlay/pages/documentation/doc-enum';
import { ToolPanelDirective } from '../../../tool-panel/tool-panel.directive';
import { LineService } from '../line.service';

// tslint:disable-next-line:no-magic-numbers
const RATIOTHICKNESS = 3 / 5;
@Component({
  selector: 'app-line-panel',
  templateUrl: './line-panel.component.html',
  styleUrls: ['./line-panel.component.scss']
})
export class LinePanelComponent extends ToolPanelDirective {

  @ViewChild ('slideToggle', {
    static: false
  }) protected slideToggle: MatSlideToggle;

  @ViewChild('thicknessSlider', {
    static: false,
    read: MatSlider
  }) private thicknessSlider: MatSlider;

  @ViewChild('radiusSlider', {
    static: false,
    read: MatSlider
  }) private radiusSlider: MatSlider;

  private lineForm: FormGroup;

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly service: LineService,
              private overlay: OverlayService,
              private formBuilder: FormBuilder) {
    super(elementRef);
    this.lineForm = this.formBuilder.group({
      thicknessFormField: [this.service.thickness, [Validators.required]],
      radiusFormField: [this.service.radius, [Validators.required]],
      jonctionOption: [this.service.withJonction, []],
      thicknessSlider: [this.service.thickness, []],
      radiusSlider: [this.service.radius, []],
    });
  }

  protected onChangeJonctionOption($event: MatSlideToggleChange): void {
    this.service.withJonction = ($event.checked);
  }

  protected onThicknessChange(): void {
    this.lineForm.patchValue
                 ({ thicknessFormField: this.thicknessSlider.value });
    this.service.thickness = this.thicknessSlider.value as number;
  }

  protected onThicknessValueChange(): void {
    const newRadiusMin = Math.floor(this.service.thickness * RATIOTHICKNESS);
    this.service.radius = Math.max(this.radiusSlider.value as number, newRadiusMin);
    this.radiusSlider.value = this.service.radius;
    this.radiusSlider.min = newRadiusMin;
    this.lineForm.patchValue({ radiusFormField: this.radiusSlider.value });
  }

  protected onRadiusChange(): void {
    this.lineForm.patchValue({ radiusFormField: this.radiusSlider.value });
    this.service.radius = this.radiusSlider.value as number;
  }

  protected showDocumentation(): void {
    this.overlay.openDocumentationDialog(false, DocEnum.line);
  }
}
