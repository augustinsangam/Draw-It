import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatButtonToggleChange} from '@angular/material/button-toggle';
import {MatSlider} from '@angular/material/slider';
import { OverlayService } from 'src/app/overlay/overlay.service';
import { DocEnum } from 'src/app/overlay/pages/documentation/doc-enum';
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
export class TextPanelComponent extends ToolPanelDirective
implements AfterViewInit {

  readonly ON_COLOR: string = '#5f4a4a';
  readonly OFF_COLOR: string = '#3b3b3b';
  readonly DISABLED_COLOR: string = '#3b3b3b';

  private textForm: FormGroup;
  private previewDims: Dimension;

  @ViewChild('fontSizeSlider', {
    static: false,
  }) private fontSizeSlider: MatSlider;

  @ViewChild('mutators', {
    static: false,
    read: ElementRef
  }) private mutators: ElementRef<HTMLElement>;

  @ViewChild('alignements', {
    static: false,
    read: ElementRef
  }) private alignements: ElementRef<HTMLElement>;

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly formBuilder: FormBuilder,
              private readonly service: TextService,
              protected readonly colorService: ColorService,
              private readonly renderer: Renderer2,
              private overlay: OverlayService
  ) {
    super(elementRef);
    this.textForm = this.formBuilder.group({
      mutatorsForm: [this.service.textMutators, []],
      fontSizeSlider: [this.service.fontSize, []],
      fontSizeFormField: [this.service.fontSize, [Validators.required]],
      alignementForm: [this.service.textAlignement, []],
      fonts: [this.service.fontsList[0].value, [Validators.required]]
    });
    this.previewDims = {width: 320, height: 200};
    this.service.indicators = { onDrag: false, onType: false };
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.service.startTypingEmitter.subscribe(() => this.startTyping());
    this.service.endTypingEmitter.subscribe(() => this.endTyping());
    this.updateButtonsStyle();
  }

  private updateButtonsStyle(): void {
    const mutatorChildren = Array.from(this.mutators.nativeElement.children);
    this.renderer.setStyle(mutatorChildren[0], 'background-color',
      this.service.textMutators.bold ? this.ON_COLOR : this.OFF_COLOR);
    this.renderer.setStyle(mutatorChildren[1], 'background-color',
      this.service.textMutators.italic ? this.ON_COLOR : this.OFF_COLOR);
    this.renderer.setStyle(mutatorChildren[2], 'background-color',
      this.service.textMutators.underline ? this.ON_COLOR : this.OFF_COLOR);
    const alignementChildren = Array.from(this.alignements.nativeElement.children);
    this.renderer.setStyle(alignementChildren[0], 'background-color',
      this.service.textAlignement === 'left' ? this.ON_COLOR : this.OFF_COLOR);
    this.renderer.setStyle(alignementChildren[1], 'background-color',
      this.service.textAlignement === 'center' ? this.ON_COLOR : this.OFF_COLOR);
    this.renderer.setStyle(alignementChildren[2], 'background-color',
      this.service.textAlignement === 'right' ? this.ON_COLOR : this.OFF_COLOR);
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

    this.updateButtonsStyle();
  }

  protected onAlignChange(event: MatButtonToggleChange): void {
    this.service.textAlignement = event.value;
    this.textForm.patchValue({
      alignementForm: event.value
    });

    this.updateButtonsStyle();
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

  private startTyping(): void {
    this.textForm.controls.fonts.disable();
    this.fontSizeSlider.disabled = true;
    [
      ...Array.from(this.mutators.nativeElement.children),
      ...Array.from(this.alignements.nativeElement.children),
    ].forEach((button: HTMLElement) => this.renderer.setStyle(button, 'background-color', this.DISABLED_COLOR));
  }

  private endTyping(): void {
    this.textForm.controls.fonts.enable();
    this.fontSizeSlider.disabled = false;
    [
      ...Array.from(this.mutators.nativeElement.children),
      ...Array.from(this.alignements.nativeElement.children),
    ].forEach((button: HTMLElement) => this.renderer.setStyle(button, 'background-color', this.DISABLED_COLOR));
    this.updateButtonsStyle();
  }

  protected showDocumentation(): void {
    this.overlay.openDocumentationDialog(false, DocEnum.text);
  }
}
