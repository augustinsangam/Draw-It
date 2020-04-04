import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSlider} from '@angular/material/slider';
import {ColorService} from '../../../color/color.service';
import {ToolPanelDirective} from '../../../tool-panel/tool-panel.directive';
import {FeatherpenService} from '../featherpen.service';

@Component({
  selector: 'app-featherpen-panel',
  templateUrl: './featherpen-panel.component.html',
  styleUrls: ['./featherpen-panel.component.scss']
})
// tslint:disable:use-lifecycle-interface
export class FeatherpenPanelComponent extends ToolPanelDirective {

  @ViewChild('lengthSlider', {
    static: false,
  }) private lengthSlider: MatSlider;

  @ViewChild('angleSlider', {
    static: false,
  }) private angleSlider: MatSlider;

  @ViewChild('prevPath', {
    static: false,
  }) private prevPathElRef: ElementRef<SVGElement>;

  private featherpenForm: FormGroup;

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly service: FeatherpenService,
              protected readonly colorService: ColorService,
              private readonly formBuilder: FormBuilder,
              private renderer: Renderer2) {
    super(elementRef);

    this.featherpenForm = this.formBuilder.group({
      lengthFormField: [this.service.length, [Validators.required]],
      lengthSlider: [this.service.length, []],
      angleFormField: [this.service.angle, [Validators.required]],
      angleSlider: [this.service.angle, []],
    });
  }

  ngOnInit(): void {
    console.log('created!');
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.updatePreview();
  }

  private updatePreview(): void {
    this.renderer.setAttribute(
      this.prevPathElRef.nativeElement,
      'd',
      this.service.previewCentered()
    );
  }

  onLengthChange(): void {
    this.featherpenForm.patchValue({
      lengthFormField: this.lengthSlider.value
    });
    this.service.length = this.lengthSlider.value as number;

    this.updatePreview();
  }

  onAngleChange(): void {
    this.featherpenForm.patchValue({
      angleFormField: this.angleSlider.value
    });
    this.service.angle = this.angleSlider.value as number;

    this.updatePreview();
  }
}
