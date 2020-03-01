import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSlider} from '@angular/material/slider';
import { Point } from 'src/app/tool/selection/point';
import {ColorService} from '../../../color/color.service';
import {ToolPanelDirective} from '../../../tool-panel/tool-panel.directive';
import {AerosolService} from '../aerosol.service';

@Component({
  selector: 'app-aerosol-panel',
  templateUrl: './aerosol-panel.component.html',
  styleUrls: ['./aerosol-panel.component.scss']
})

// tslint:disable:use-lifecycle-interface
export class AerosolPanelComponent extends ToolPanelDirective
  implements AfterViewInit {

  private aerosolForm: FormGroup;

  @ViewChild('thicknessSlider', {
    static: false,
  }) private thicknessSlider: MatSlider;

  @ViewChild('frequencySlider', {
    static: false,
  }) private frequencySlider: MatSlider;

  @ViewChild('prevPath', {
    static: false,
  }) private prevPathRef: ElementRef<SVGPathElement>;

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

  // TODO fix the panel not opening when using ngAfterViewInit
  ngAfterViewInit() {
    super.ngAfterViewInit();
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
    let preview = '';
    for (let i = 0; i < this.service.frequency; i++) {
      preview += this.service.generatePoints(new Point(150, 110));
    }
    this.renderer.setAttribute(
      this.prevPathRef.nativeElement,
      'd',
      preview
    );
  }
}
