import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {
  MatSlideToggle,
  MatSlideToggleChange
} from '@angular/material/slide-toggle';
import {MatSlider} from '@angular/material/slider';
import {ToolPanelDirective} from '../../../tool-panel/tool-panel.directive';
import {EllipseService} from '../ellipse.service';

@Component({
  selector: 'app-ellipse-panel',
  templateUrl: './ellipse-panel.component.html',
  styleUrls: ['./ellipse-panel.component.scss']
})
export class EllipsePanelComponent
  extends ToolPanelDirective implements AfterViewChecked {

  private ellipseForm: FormGroup;

  @ViewChild('fillOptionRef', {
    static: false,
    read: MatSlideToggle
  }) protected fillOptionRef: MatSlideToggle;

  @ViewChild('borderOptionRef', {
    static: false,
    read: MatSlideToggle
  }) protected borderOptionRef: MatSlideToggle;

  @ViewChild('thicknessSlider', {
    static: false,
    read: MatSlider
  }) protected thicknessSlider: MatSlider;

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly service: EllipseService,
              private readonly formBuilder: FormBuilder) {
    super(elementRef);
    this.ellipseForm = this.formBuilder.group({
      thicknessFormField: [this.service.thickness, []],
      borderOption: [this.service.borderOption, []],
      thicknessSlider: [this.service.thickness, []],
      fillOption: [this.service.fillOption, []]
    })
  }

  ngAfterViewChecked(): void {
    this.fillOptionRef.change.subscribe(($event: MatSlideToggleChange) => {
      this.service.fillOption = ($event.checked);
      if (!$event.checked) {
        this.borderOptionRef.disabled = true;
        this.ellipseForm.controls.borderOption.disable();
      } else {
        this.borderOptionRef.disabled = false;
        this.ellipseForm.controls.borderOption.enable();
      }
    });

    this.borderOptionRef.change.subscribe( ($event: MatSlideToggleChange) => {
      this.service.borderOption = $event.checked;
      if (!$event.checked) {
        this.fillOptionRef.disabled = true;
        this.ellipseForm.controls.fillOption.disable();
      } else {
        this.fillOptionRef.disabled = false;
        this.ellipseForm.controls.fillOption.enable();
      }
    });
  }

  protected onThicknessChange(): void {
    this.ellipseForm.patchValue({
      thicknessFormField: this.thicknessSlider.value
    });
    this.service.thickness = this.thicknessSlider.value as number
  }

}
