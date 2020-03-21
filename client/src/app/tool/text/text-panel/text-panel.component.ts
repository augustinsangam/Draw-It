import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatButtonToggleChange} from '@angular/material/button-toggle';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatSlider} from '@angular/material/slider';
import {ColorService} from '../../color/color.service';
import {Dimension} from '../../shape/common/dimension';
import {ToolPanelDirective} from '../../tool-panel/tool-panel.directive';
import {TextMutators} from '../text-mutators';
import {TextService} from '../text.service';

@Component({
  selector: 'app-text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss']
})
export class TextPanelComponent extends ToolPanelDirective {

  private textForm: FormGroup;
  private showFonts: boolean;
  private previewDims: Dimension;

  @ViewChild('fontsToggle', {
    static: false,
    read: MatSlideToggle
  }) private fontsToggleRef: MatSlideToggle;

  @ViewChild('fontSizeSlider', {
    static: false,
  }) private fontSizeSlider: MatSlider;

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly formBuilder: FormBuilder,
              private readonly service: TextService,
              private readonly colorService: ColorService // value is only read in the html... ts-ignore ?
  ) {
    super(elementRef);
    this.showFonts = false;
    this.textForm = this.formBuilder.group({
      showFontsToggleForm: [this.showFonts, []],
      fontForm: [this.service.currentFont, []],
      mutatorsForm: [this.service.textMutators, []],
      fontSizeSlider: [this.service.fontSize, []],
      fontSizeFormField: [this.service.fontSize, [Validators.required]],
      alignementForm: [this.service.textAlignement, []],
    });
    this.previewDims = {width: 320, height: 200};
  }

  onMutatorChange(event: MatButtonToggleChange): void {
    const newMutators: TextMutators = {
      bold: event.value === 'bold' ? !this.service.textMutators.bold : this.service.textMutators.bold,
      italic: event.value === 'italic' ? !this.service.textMutators.italic : this.service.textMutators.italic,
      underline: event.value === 'underline' ? !this.service.textMutators.underline : this.service.textMutators.underline
    };
    this.textForm.patchValue({
      mutatorsForm: newMutators
    });
    this.service.textMutators = newMutators;
  }

  onAlignChange(event: MatButtonToggleChange): void {
    this.service.textAlignement = event.value;
    this.textForm.patchValue({
      alignementForm: event.value
    });
  }

  onFontSizeChange(): void {
    this.textForm.patchValue({
      fontSizeForm: this.fontSizeSlider.value
    });
    this.service.fontSize = this.fontSizeSlider.value as number;
  }

}
