import { Injectable } from '@angular/core';

import { ToolService } from '../../tool.service';

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
  isFirstLoaded: boolean;
  thickness: number;
  texture: Texture ;

  constructor() {
    super();
    this.thickness = 20;
    this.isFirstLoaded = true;
    this.texture = Texture.Texture1;
  }

}
