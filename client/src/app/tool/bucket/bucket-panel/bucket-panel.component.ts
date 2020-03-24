import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlider } from '@angular/material';
import { ToolPanelDirective } from '../../tool-panel/tool-panel.directive';
import { BucketService } from '../bucket.service';

@Component({
  selector: 'app-bucket-panel',
  templateUrl: './bucket-panel.component.html',
  styleUrls: ['./bucket-panel.component.scss']
})
export class BucketPanelComponent extends ToolPanelDirective {

  private bucketForm: FormGroup;

  @ViewChild('toleranceSlider', {
    static: false,
  }) private toleranceSlider: MatSlider;

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly service: BucketService,
              private readonly formBuilder: FormBuilder) {
    super(elementRef);
    this.bucketForm = this.formBuilder.group({
      toleranceFormField: [this.service.tolerance, [Validators.required]],
      toleranceSlider: [this.service.tolerance, []],
    });
  }

  protected onToleranceChange(): void {
    this.bucketForm.patchValue
              ({ toleranceFormField: this.toleranceSlider.value });
    this.service.tolerance = this.toleranceSlider.value as number;
  }

}
