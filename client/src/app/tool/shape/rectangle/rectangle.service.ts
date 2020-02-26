import { Injectable } from '@angular/core';

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
export class RectangleService extends ToolService {
  borderOption: boolean;
  fillOption: boolean;
  thickness: number;

  constructor(
    shortCutHandlerService: ShortcutHandlerService,
    toolSelectorService: ToolSelectorService,
  ) {
    super();
    shortCutHandlerService.set(Shortcut._1,
      () => toolSelectorService.set(Tool.Rectangle));
    this.borderOption = true;
    this.fillOption = true;
    this.thickness = 2;
  }
}
