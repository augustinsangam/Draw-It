import { Injectable } from '@angular/core';

import { ToolService } from '../../tool.service';

export enum Texture {
  Texture1 = 'filter1',
  Texture2 = 'filter2',
  Texture3 = 'filter3',
  Texture4 = 'filter4',
  Texture5 = 'filter5'
}

const DEFAULT_THIKCNESS = 20;

@Injectable({
  providedIn: 'root'
})
export class BrushService extends ToolService {
  isFirstLoaded: boolean;
  thickness: number;
  texture: Texture ;

  constructor() {
    super();
    this.thickness = DEFAULT_THIKCNESS;
    this.isFirstLoaded = true;
    this.texture = Texture.Texture2;
  }

}
