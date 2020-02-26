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
export class PencilService extends ToolService {
  thickness: number;

  constructor(
    shortCutHandlerService: ShortcutHandlerService,
    toolSelectorService: ToolSelectorService,
  ) {
    super();
    shortCutHandlerService.set(Shortcut.C,
      () => toolSelectorService.set(Tool.Pencil));
    this.thickness = 10;
  }
}
