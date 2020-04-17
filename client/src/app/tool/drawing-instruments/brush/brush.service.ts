import { Injectable } from '@angular/core';

import { ToolService } from '../../tool.service';

export enum Texture {
  TEXTURE_1 = 'filter1',
  TEXTURE_2 = 'filter2',
  TEXTURE_3 = 'filter3',
  TEXTURE_4 = 'filter4',
  TEXTURE_5 = 'filter5'
}

@Injectable({
  providedIn: 'root'
})
export class BrushService extends ToolService {

  private static readonly DEFAULT_THICKNESS: number = 20;
  thickness: number;
  texture: Texture ;

  constructor() {
    super();
    this.thickness = BrushService.DEFAULT_THICKNESS;
    this.texture = Texture.TEXTURE_2;
  }

}
