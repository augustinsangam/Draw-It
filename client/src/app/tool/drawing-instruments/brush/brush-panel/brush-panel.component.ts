import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange, MatSlider } from '@angular/material';
import { MatRadioButton } from '@angular/material/radio';

import { OverlayService } from 'src/app/overlay/overlay.service';
import { DocEnum } from 'src/app/overlay/pages/documentation/doc-enum';
import { ToolPanelDirective } from '../../../tool-panel/tool-panel.directive';
import { BrushService, Texture } from '../brush.service';

interface TextureItem {
  value: Texture;
  name: string;
  src: string;
}

@Component({
  selector: 'app-brush-panel',
  templateUrl: './brush-panel.component.html',
  styleUrls: ['./brush-panel.component.scss']
})
export class BrushPanelComponent extends ToolPanelDirective {

  @ViewChild('radioChoice', {
    static: false
  })
  protected radioChoice: MatRadioButton;

  @ViewChild('thicknessSlider', {
    static: false
  })
  private thicknessSlider: MatSlider;

  private brushForm: FormGroup;
  protected textures: TextureItem[];

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private readonly service: BrushService,
    private overlay: OverlayService,
    private formBuilder: FormBuilder
  ) {
    super(elementRef);
    this.brushForm = this.formBuilder.group({
      thicknessFormField: [this.service.thickness, [Validators.required]],
      thicknessSlider: [this.service.thickness, []],
      textureOption: [this.service.texture, []]
    });
    this.initialiseTextures();
  }

  private initialiseTextures(): void {
    this.textures = [
      {
        value: Texture.TEXTURE_2,
        name: 'Flou',
        src: '/assets/textures/texture2.png'
      },
      {
        value: Texture.TEXTURE_3,
        name: 'Ombre',
        src: '/assets/textures/texture3.png'
      },
      {
        value: Texture.TEXTURE_4,
        name: 'Graffiti',
        src: '/assets/textures/texture4.png'
      },
      {
        value: Texture.TEXTURE_5,
        name: 'Poussière',
        src: '/assets/textures/texture5.png'
      },
      {
        value: Texture.TEXTURE_1,
        name: 'Fractal',
        src: '/assets/textures/texture1.png'
      },
    ];
  }

  protected onThicknessChange(): void {
    this.brushForm.patchValue({
      thicknessFormField: this.thicknessSlider.value
    });
    this.service.thickness = this.thicknessSlider.value as number;
  }

  protected onOptionChange($event: MatRadioChange): void {
    this.service.texture = $event.value;
  }

  protected showDocumentation(): void {
    this.overlay.openDocumentationDialog(false, DocEnum.BRUSH);
  }

}
