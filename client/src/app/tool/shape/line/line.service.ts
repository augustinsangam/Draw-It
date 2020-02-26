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
export class LineService extends ToolService {
  radius: number;
  thickness: number;
  withJonction: boolean;

  constructor(
    shortCutHandlerService: ShortcutHandlerService,
    toolSelectorService: ToolSelectorService,
  ) {
    super();
    shortCutHandlerService.set(Shortcut.L,
      () => toolSelectorService.set(Tool.Line));
    this.radius = 2;
    this.thickness = 2;
    this.withJonction = true;
  }
}
