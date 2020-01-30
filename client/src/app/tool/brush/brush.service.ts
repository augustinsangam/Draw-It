import { Injectable } from '@angular/core';

import { ToolService } from '../tool.service';

export enum Texture {
  Texture1 = 'Texture 1',
  Texture2 = 'Texture 2',
  Texture3 = 'Texture 3',
  Texture4 = 'Texture 4',
  Texture5 = 'Texture 5'
};

@Injectable({
  providedIn: 'root'
})
export class BrushService extends ToolService {

  thickness = 10;
  texture = Texture.Texture2;

  constructor() {
    super();
  }

}
