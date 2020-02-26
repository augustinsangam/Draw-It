import { Injectable } from '@angular/core';

import { Texture } from '../../../constants/constants';
import {
  Shortcut, ShortcutHandlerService,
} from '../../../shortcut-handler/shortcut-handler.service';
import {
  ToolSelectorService,
} from '../../../tool-selector/tool-selector.service';
import { Tool } from '../../tool.enum';
import { ToolService } from '../../tool.service';

@Injectable({
  providedIn: 'root',
})
export class BrushService extends ToolService {
  isFirstLoaded: boolean;
  thickness: number;
  texture: Texture;

  constructor(
    shortCutHandlerService: ShortcutHandlerService,
    toolSelectorService: ToolSelectorService,
  ) {
    super();
    shortCutHandlerService.set(Shortcut.W,
      () => toolSelectorService.set(Tool.Brush));
    this.thickness = 20;
    this.isFirstLoaded = true;
    this.texture = Texture.Texture2;
  }
}
