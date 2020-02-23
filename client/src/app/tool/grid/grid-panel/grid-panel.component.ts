import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatSlider} from '@angular/material/slider';
import {ToolPanelDirective} from '../../tool-panel/tool-panel.directive';
import {GridService} from '../grid.service';

@Component({
  selector: 'app-grid-panel',
  templateUrl: './grid-panel.component.html',
  styleUrls: ['./grid-panel.component.scss']
})
// tslint:disable:use-lifecycle-interface
export class GridPanelComponent extends ToolPanelDirective {

  private gridForm: FormGroup;

  @ViewChild('activeToggle', {
    static: false,
    read: MatSlideToggle
  }) private activeToggleRef: MatSlideToggle;

  @ViewChild('squareSizeSlider', {
    static: false,
  }) private squareSizeSlider: MatSlider;

  @ViewChild('opacitySlider', {
    static: false,
  }) private opacitySlider: MatSlider;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private readonly formBuilder: FormBuilder,
    private readonly service: GridService
  ) {
    super(elementRef);
    this.gridForm = this.formBuilder.group({
      activeToggleForm: [this.service.active, []],
      squareSizeFormField: [this.service.squareSize, [Validators.required]],
      squareSizeSlider: [this.service.squareSize, []],
      opacityFormField: [this.service.opacity, [Validators.required]],
      opacitySlider: [this.service.opacity, []],
    });
  }

  ngOnInit() {
    this.service.keyboardChanges.subscribe((keyCode: string) =>
      this.handleServiceChange(keyCode)
    );
  }

  protected onSquareSizeChange(): void {
    this.gridForm.patchValue({
      squareSizeFormField: this.squareSizeSlider.value
    });
    this.service.squareSize = this.squareSizeSlider.value as number;
    this.service.sliderChanges.next();
  }

  protected onOpacityChange(): void {
    this.gridForm.patchValue({
      opacityFormField: this.opacitySlider.value
    });
    this.service.opacity = this.opacitySlider.value as number;
    this.service.sliderChanges.next();
  }

  protected onActiveChange(): void {
    this.gridForm.patchValue({
      activeToggleForm: this.activeToggleRef.checked
    });
    this.service.active = this.activeToggleRef.checked;
    this.service.sliderChanges.next();
  }

  protected handleServiceChange(keyCode: string) {
    this.activeToggleRef.checked = this.service.active;
    this.gridForm.patchValue({
      activeToggleForm: this.service.active
    });

    if ((keyCode === 'NumpadAdd' || keyCode === 'NumpadSubtract')
      && this.service.active) {
      this.squareSizeSlider.value = this.service.squareSize;
      this.gridForm.patchValue({
        squareSizeFormField: this.service.squareSize
      });
    }

    this.service.sliderChanges.next();
  }

}
