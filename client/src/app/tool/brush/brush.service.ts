import { Injectable } from '@angular/core';

import { ToolService } from '../tool.service';

export enum Texture {
  Texture1 = 'filter1',
  Texture2 = 'filter2',
  Texture3 = 'filter3',
  Texture4 = 'filter4',
  Texture5 = 'filter5'
};

@Injectable({
  providedIn: 'root'
})
export class BrushService extends ToolService {

  thickness: number;
  texture: Texture;

  constructor() {
    super();
    this.thickness = 10;
    this.texture = Texture.Texture1;
  }

}
