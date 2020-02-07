import {Component, ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material';
import { MatRadioButton } from '@angular/material/radio';

import { ToolPanelDirective } from '../../tool-panel/tool-panel.directive';
import { BrushService, Texture } from '../brush.service';

@Component({
  selector: 'app-brush-panel',
  templateUrl: './brush-panel.component.html',
  styleUrls: ['./brush-panel.component.scss']
})
export class BrushPanelComponent extends ToolPanelDirective {

  private brushForm: FormGroup;

  @ViewChild('radioChoice', {
    static: false
  }) protected radioChoice: MatRadioButton;

  protected textures = [
    {
      value: Texture.Texture1,
      name: 'Fractal',
      src: '/assets/texture1.png',
    },
    {
      value: Texture.Texture2,
      name: 'Flou',
      src: '/assets/texture2.png',
    },
    {
      value: Texture.Texture3,
      name: 'Ombre',
      src: '/assets/texture3.png',
    },
    {
      value: Texture.Texture4,
      name: 'Graffiti',
      src: '/assets/texture4.png',
    },
    {
      value: Texture.Texture5,
      name: 'Poussière',
      src: '/assets/texture5.png',
    },
  ];

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly service: BrushService,
              private formBuilder: FormBuilder) {
    super(elementRef);
    this.brushForm = this.formBuilder.group({
      thicknessFormField: [this.service.thickness, [Validators.required]],
      thicknessSlider: [this.service.thickness, []],
      textureOption: [this.service.texture, []],
    });
  }

  protected onThicknessChange(): void {
    this.brushForm.patchValue({ thicknessFormField: this.brushForm.value.thicknessSlider });
    this.service.thickness = this.brushForm.value.thicknessSlider;
  }

  protected onOptionChange($event: MatRadioChange): void {
    this.service.texture = $event.value;
  }

}
