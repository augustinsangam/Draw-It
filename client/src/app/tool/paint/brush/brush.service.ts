import { Injectable } from '@angular/core';

import { Texture } from 'src/app/constants/constants';
import { ToolService } from '../../tool.service';

@Injectable({
  providedIn: 'root',
})
export class BrushService extends ToolService {
  isFirstLoaded: boolean;
  thickness: number;
  texture: Texture;

  constructor() {
    super();
    this.thickness = 20;
    this.isFirstLoaded = true;
    this.texture = Texture.Texture2;
  }
}
