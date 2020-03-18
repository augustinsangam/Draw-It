import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {ToolPanelDirective} from '../../tool-panel/tool-panel.directive';
import {TextService} from '../text.service';
import {MatButtonToggleChange} from '@angular/material/button-toggle';
import {TextMutators} from '../text-mutators';
import {MatSlider} from '@angular/material/slider';

@Component({
  selector: 'app-text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss']
})
export class TextPanelComponent extends ToolPanelDirective {

  private textForm: FormGroup;

  @ViewChild('fontsToggle', {
    static: false,
    read: MatSlideToggle
  }) private fontsToggleRef: MatSlideToggle;

  @ViewChild('fontSizeSlider', {
    static: false,
  }) private fontSizeSlider: MatSlider;

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly formBuilder: FormBuilder,
              private readonly service: TextService
  ) {
    super(elementRef);
    this.textForm = this.formBuilder.group({
      showFontsToggleForm: [this.service.showFonts, []],
      fontForm: [this.service.font, []],
      mutatorsForm: [this.service.textMutators, []],
      fontSizeSlider: [this.service.fontSize, []],
      fontSizeFormField: [this.service.fontSize, [Validators.required]],
    });
  }

  onShowFontsChange(): void {
    this.textForm.patchValue({
      showFontsToggleForm: this.fontsToggleRef.checked
    });
    this.service.showFonts = this.fontsToggleRef.checked;
  }

  onFontSelected(font: string): void {
    this.textForm.patchValue({
      fontForm: font
    });
    this.service.font = font;
    console.log(this.service.font);
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
    console.log(this.service.textMutators);
  }

  onFontSizeChange(): void {
    this.textForm.patchValue({
      fontSizeForm: this.fontSizeSlider.value
    });
    this.service.fontSize = this.fontSizeSlider.value as number;
  }

}
