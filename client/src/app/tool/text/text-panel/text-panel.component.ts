import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {ToolPanelDirective} from '../../tool-panel/tool-panel.directive';
import {TextService} from '../text.service';
import {MatButtonToggleChange} from '@angular/material/button-toggle';
import {TextMutators} from '../text-mutators';
import {MatSlider} from '@angular/material/slider';
import {ColorService} from '../../color/color.service';
import {Dimension} from '../../shape/common/dimension';
import {TextAlignement} from '../text-alignement';

@Component({
  selector: 'app-text-panel',
  templateUrl: './text-panel.component.html',
  styleUrls: ['./text-panel.component.scss']
})
export class TextPanelComponent extends ToolPanelDirective
implements OnInit {

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
  }

  ngOnInit(): void {
    this.previewDims = {width: 320, height: 200};
  }

  onShowFontsChange(): void {
    this.textForm.patchValue({
      showFontsToggleForm: this.fontsToggleRef.checked
    });
    this.showFonts = this.fontsToggleRef.checked;
  }

  onFontSelected(font: string): void {
    this.textForm.patchValue({
      fontForm: font
    });
    this.service.currentFont = font;
    console.log(this.service.currentFont);
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

  getTextAlign(width: number, height: number): string {
    return this.service.textAlignement === TextAlignement.left ? '0' : (
      this.service.textAlignement === TextAlignement.center ? `${width / 2}` : `${width}`
    );
  }

  getTextAnchor(): string {
    return this.service.textAlignement === 'left' ? 'start' : (
      this.service.textAlignement === 'center' ? 'middle' : 'end'
    );
  }
  onAlignChange(event: MatButtonToggleChange): void {
    this.service.textAlignement = event.value;
    this.textForm.patchValue({
      alignementForm: event.value
    });
    console.log(this.service.textAlignement);
  }

  onFontSizeChange(): void {
    this.textForm.patchValue({
      fontSizeForm: this.fontSizeSlider.value
    });
    this.service.fontSize = this.fontSizeSlider.value as number;
  }

}
