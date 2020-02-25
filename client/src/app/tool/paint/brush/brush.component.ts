import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';
import { MatSlider } from '@angular/material/slider';

import { Texture } from '../../../constants/constants';
import { ToolComponent } from '../../tool.component';
import { BrushService } from './brush.service';

@Component({
  selector: 'app-brush',
  styleUrls: [
    './brush.component.css',
  ],
  templateUrl: './brush.component.html',
})
export class BrushComponent extends ToolComponent {
  brushForm: FormGroup;

  @ViewChild('radioChoice', {
    static: false
  })
  protected radioChoice: MatRadioButton;

  @ViewChild('thicknessSlider', {
    static: false
  })
  private thicknessSlider: MatSlider;

  textures = [
    {
      value: Texture.Texture2,
      name: 'Flou',
      src: '/assets/textures/texture2.png'
    },
    {
      value: Texture.Texture3,
      name: 'Ombre',
      src: '/assets/textures/texture3.png'
    },
    {
      value: Texture.Texture4,
      name: 'Graffiti',
      src: '/assets/textures/texture4.png'
    },
    {
      value: Texture.Texture5,
      name: 'Poussière',
      src: '/assets/textures/texture5.png'
    },
    {
      value: Texture.Texture1,
      name: 'Fractal',
      src: '/assets/textures/texture1.png'
    },
  ];

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private readonly service: BrushService,
    private formBuilder: FormBuilder
  ) {
    super(elementRef);
    this.brushForm = this.formBuilder.group({
      thicknessFormField: [this.service.thickness, [Validators.required]],
      thicknessSlider: [this.service.thickness, []],
      textureOption: [this.service.texture, []]
    });
  }

  onThicknessChange(): void {
    this.brushForm.patchValue({
      thicknessFormField: this.thicknessSlider.value
    });
    this.service.thickness = this.thicknessSlider.value as number;
  }

  onOptionChange($event: MatRadioChange): void {
    this.service.texture = $event.value;
  }
}
