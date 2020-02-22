import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSlider} from '@angular/material/slider';
import {ColorService} from '../../../color/color.service';
import {ToolPanelDirective} from '../../../tool-panel/tool-panel.directive';
import {AerosolService} from '../aerosol.service';
import { Point } from 'src/app/tool/selection/Point';

@Component({
  selector: 'app-aerosol-panel',
  templateUrl: './aerosol-panel.component.html',
  styleUrls: ['./aerosol-panel.component.scss']
})

// tslint:disable:use-lifecycle-interface
export class AerosolPanelComponent extends ToolPanelDirective {

  private aerosolForm: FormGroup;

  @ViewChild('thicknessSlider', {
    static: false,
  }) private thicknessSlider: MatSlider;

  @ViewChild('frequencySlider', {
    static: false,
  }) private frequencySlider: MatSlider;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private readonly service: AerosolService,
    protected readonly colorService: ColorService,
    private readonly formBuilder: FormBuilder) {
    super(elementRef);
    this.aerosolForm = this.formBuilder.group({
      thicknessFormField: [this.service.thickness, [Validators.required]],
      thicknessSlider: [this.service.thickness, []],
      frequencyFormField: [this.service.frequency, [Validators.required]],
      frequencySlider: [this.service.frequency, []],
    });
  }

  ngOnInit() {
    this.updateThumbnail()
  }

  protected onThicknessChange(): void {
    this.aerosolForm.patchValue({
      thicknessFormField: this.thicknessSlider.value
    });
    this.service.thickness = this.thicknessSlider.value as number;
    this.updateThumbnail();
  }

  protected onFrequencyChange(): void {
    this.aerosolForm.patchValue({
      frequencyFormField: this.frequencySlider.value
    });
    this.service.frequency = this.frequencySlider.value as number;
    this.updateThumbnail();
  }

  protected updateThumbnail() {
    const path = document.getElementById('prevPath');
    if (!!path) {
      let preview = '';
      for (let i = 0; i < this.service.frequency; i++) {
        preview += this.service.generatePoints(new Point(150, 110));
      }
      path.setAttribute('d', preview);
    }
  }

}
