import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatButtonToggleChange} from '@angular/material/button-toggle';
import {MatSlider} from '@angular/material/slider';
import {ColorService} from '../../color/color.service';
import {Dimension} from '../../shape/common/dimension';
import {ToolPanelDirective} from '../../tool-panel/tool-panel.directive';
import {TextAlignement} from '../text-classes/text-alignement';
import {TextMutators} from '../text-classes/text-mutators';
import {TextService} from '../text.service';

@Component({
  selector: 'app-text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss']
})
export class TextPanelComponent extends ToolPanelDirective {

  private textForm: FormGroup;
  private previewDims: Dimension;

  @ViewChild('fontSizeSlider', {
    static: false,
  }) private fontSizeSlider: MatSlider;

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly formBuilder: FormBuilder,
              private readonly service: TextService,
              protected readonly colorService: ColorService
  ) {
    super(elementRef);
    this.textForm = this.formBuilder.group({
      mutatorsForm: [this.service.textMutators, []],
      fontSizeSlider: [this.service.fontSize, []],
      fontSizeFormField: [this.service.fontSize, [Validators.required]],
      alignementForm: [this.service.textAlignement, []],
    });
    this.previewDims = {width: 320, height: 200};
    this.service.indicators = { onDrag: false, onType: false };
  }

  protected onMutatorChange(event: MatButtonToggleChange): void {
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

  protected onAlignChange(event: MatButtonToggleChange): void {
    this.service.textAlignement = event.value;
    this.textForm.patchValue({
      alignementForm: event.value
    });
  }

  protected onFontSizeChange(): void {
    this.textForm.patchValue({
      fontSizeForm: this.fontSizeSlider.value
    });
    this.service.fontSize = this.fontSizeSlider.value as number;
  }

  protected getPreviewTextAlign(): number {
    if (this.service.textAlignement === TextAlignement.left) {
      return 0;
    }

    return this.service.textAlignement === TextAlignement.center
      ? this.previewDims.width / 2
      : this.previewDims.width;
  }

}
