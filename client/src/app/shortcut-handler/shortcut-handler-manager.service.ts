import { Injectable } from '@angular/core';
import { OverlayService } from '../overlay/overlay.service';
import { GridService } from '../tool/grid/grid.service';
import {
  ToolSelectorService
} from '../tool/tool-selector/tool-selector.service';
import { Tool } from '../tool/tool.enum';
import { UndoRedoService } from '../tool/undo-redo/undo-redo.service';
import {
  Shortcut,
  ShortcutCallBack,
  ShortcutHandlerService
} from './shortcut-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ShortcutHandlerManagerService {

  private handlersFunc: Map<Shortcut, ShortcutCallBack>;

  constructor(
    private readonly toolSelectorService: ToolSelectorService,
    private shortcutHanler: ShortcutHandlerService,
    private gridService: GridService,
    private undoRedoService: UndoRedoService,
    private overlayService: OverlayService,
  ) {
  }

  initialiseShortcuts(): void {

    this.handlersFunc = new Map();
    this.handlersFunc.set(Shortcut.C, () =>
      this.toolSelectorService.set(Tool.Pencil)
    );
    this.handlersFunc.set(Shortcut.L, () =>
      this.toolSelectorService.set(Tool.Line)
    );
    this.handlersFunc.set(Shortcut.W, () =>
      this.toolSelectorService.set(Tool.Brush)
    );
    this.handlersFunc.set(Shortcut.Digit1, () =>
      this.toolSelectorService.set(Tool.Rectangle)
    );
    this.handlersFunc.set(Shortcut.Digit2, () =>
      this.toolSelectorService.set(Tool.Ellipse)
    );
    this.handlersFunc.set(Shortcut.Digit3, () =>
      this.toolSelectorService.set(Tool.Polygone)
    );
    this.handlersFunc.set(Shortcut.I, () =>
      this.toolSelectorService.set(Tool.Pipette)
    );
    this.handlersFunc.set(Shortcut.E, (event: KeyboardEvent) => {
      event.preventDefault();
      if (event.ctrlKey) {
        this.overlayService.openExportDialog();
      } else {
        this.toolSelectorService.set(Tool.Eraser);
      }
    }
    );
    this.handlersFunc.set(Shortcut.G, (event: KeyboardEvent) => {
      if (!!event && event.ctrlKey) {
        event.preventDefault();
        this.overlayService.openGaleryDialog(false);
      } else {
        this.gridService.keyEvHandler('g');
      }
    });
    this.handlersFunc.set(Shortcut.plus, () => {
      this.gridService.keyEvHandler('+');
    });
    this.handlersFunc.set(Shortcut.minus, () => {
      this.gridService.keyEvHandler('-');
    });
    this.handlersFunc.set(Shortcut.Z, (event: KeyboardEvent) => {
      if (!!event && event.ctrlKey) {
        event.preventDefault();
        this.undoRedoService.undo();
      }
    });
    this.handlersFunc.set(Shortcut.ZShift, (event: KeyboardEvent) => {
      if (!!event && event.ctrlKey && event.shiftKey) {
        event.preventDefault();
        this.undoRedoService.redo();
      }
    });

    this.handlersFunc.set(Shortcut.S, (event: KeyboardEvent) => {
      event.preventDefault();
      if ( !event.ctrlKey ) {
        this.toolSelectorService.set(Tool.Selection);
      } else {
        this.overlayService.openSaveDialog();
      }
    });
    this.handlersFunc.set(Shortcut.R, () =>
      this.toolSelectorService.set(Tool.Applicator));

    for (const entry of this.handlersFunc) {
      this.shortcutHanler.set(
        entry[0],
        this.handlersFunc.get(entry[0]) as ShortcutCallBack
      );
    }
  }
}
