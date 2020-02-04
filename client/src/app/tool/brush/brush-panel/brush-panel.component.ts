import {Component, ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material';
import {MatRadioButton} from '@angular/material/radio';

import { ToolPanelComponent } from '../../tool-panel/tool-panel.component';
import { BrushService, Texture } from '../brush.service';

@Component({
  selector: 'app-brush-panel',
  templateUrl: './brush-panel.component.html',
  styleUrls: ['./brush-panel.component.scss']
})
export class BrushPanelComponent extends ToolPanelComponent {
  brushForm: FormGroup;

  @ViewChild('radioChoice', {
    static: false
  }) radioChoice: MatRadioButton;

  textures = [
    {
      value: Texture.Texture1,
      src: '/assets/texture1.png',
    },
    {
      value: Texture.Texture2,
      src: '/assets/texture2.png',
    },
    {
      value: Texture.Texture3,
      src: '/assets/texture3.png',
    },
    {
      value: Texture.Texture4,
      src: '/assets/texture4.png',
    },
    {
      value: Texture.Texture5,
      src: '/assets/texture5.png',
    },
  ];

  constructor(elementRef: ElementRef<HTMLElement>,
              readonly service: BrushService,
              private formBuilder: FormBuilder) {
    super(elementRef);
    this.brushForm = this.formBuilder.group({
      thicknessFormField: [this.service.thickness, [Validators.required]],
      thicknessSlider: [this.service.thickness, []],
      textureOption: [this.service.texture, []],
    });
  }

  onThicknessChange() {
    this.brushForm.patchValue({ thicknessFormField: this.brushForm.value.thicknessSlider });
    this.service.thickness = this.brushForm.value.thicknessSlider;
  }

  onOptionChange($event: MatRadioChange) {
    this.service.texture = $event.value;
  }
}
