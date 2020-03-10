import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { Point } from 'src/app/tool/shape/common/point';
import { ColorService } from '../../../color/color.service';
import { ToolPanelDirective } from '../../../tool-panel/tool-panel.directive';
import { AerosolService } from '../aerosol.service';

const PREVIEW_CENTER = {
  x: 150,
  y: 110
};

@Component({
  selector: 'app-aerosol-panel',
  templateUrl: './aerosol-panel.component.html',
  styleUrls: ['./aerosol-panel.component.scss']
})

export class AerosolPanelComponent extends ToolPanelDirective
  implements AfterViewInit {

  @ViewChild('thicknessSlider', {
    static: false,
  }) private thicknessSlider: MatSlider;

  @ViewChild('frequencySlider', {
    static: false,
  }) private frequencySlider: MatSlider;

  @ViewChild('prevPath', {
    static: false,
  }) private prevPathRef: ElementRef<SVGPathElement>;

  private aerosolForm: FormGroup;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private readonly service: AerosolService,
    protected readonly colorService: ColorService,
    private readonly formBuilder: FormBuilder,
    private renderer: Renderer2) {
    super(elementRef);
    this.aerosolForm = this.formBuilder.group({
      thicknessFormField: [this.service.thickness, [Validators.required]],
      thicknessSlider: [this.service.thickness, []],
      frequencyFormField: [this.service.frequency, [Validators.required]],
      frequencySlider: [this.service.frequency, []],
    });
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.updateThumbnail();
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

  protected updateThumbnail(): void {
    let preview = '';
    for (let i = 0; i < this.service.frequency; i++) {
      preview += this.service.generatePoints(new Point(PREVIEW_CENTER.x, PREVIEW_CENTER.y));
    }
    this.renderer.setAttribute(
      this.prevPathRef.nativeElement,
      'd',
      preview
    );
  }
}
