import { Injectable } from '@angular/core';

export enum Shortcut {
  CTRL_O = 'truefalseKeyO',
  CTRL_S = 'truefalseKeyS',
  CTRL_Z = 'truefalseKeyZ',
  CTRL_SHIFT_Z = 'truetrueKeyZ',
  A = 'falsefalseKeyA',
  C = 'falsefalseKeyC',
  E = 'falsefalseKeyE',
  L = 'falsefalseKeyL',
  O = 'falsefalseKeyO',
  S = 'falsefalseKeyS',
  W = 'falsefalseKeyW',
  Z = 'falsefalseKeyZ',
  _1 = 'falsefalseDigit1',
  _2 = 'falsefalseDigit2',
  _3 = 'falsefalseDigit3',
}

type ShortcutHandlerCallBack = (event: KeyboardEvent) => void;

interface ShortcutHandler {
  handlerFunction: ShortcutHandlerCallBack;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ShortcutHandlerService {
  private readonly history: Map<string, ShortcutHandler>[];
  private manager: Map<string, ShortcutHandler>;

  constructor() {
    this.history = new Array();
    this.manager = new Map();
  }

  emit(keyEv: KeyboardEvent): void {
    const shortcut = `${keyEv.ctrlKey}${keyEv.shiftKey}${keyEv.code}`;
    const shortcutHanlder = this.manager.get(shortcut);
    if (shortcutHanlder?.isActive) {
      shortcutHanlder.handlerFunction(keyEv);
    }
  }

  activate(shortcut: Shortcut): void {
    const shortcutCtx = this.manager.get(shortcut);
    if (!!shortcutCtx) {
      shortcutCtx.isActive = true;
    }
  }

  desactivate(shortcut: Shortcut): void {
    const shortcutCtx = this.manager.get(shortcut);
    if (!!shortcutCtx) {
      shortcutCtx.isActive = false;
    }
  }

  activateAll(): void {
    this.manager.forEach((handler) => handler.isActive = true);
  }

  desactivateAll(): void {
    this.manager.forEach((handler) => handler.isActive = false);
  }

  set(shortcut: Shortcut, handlerFunction: ShortcutHandlerCallBack): void {
    this.manager.set(shortcut, {
      handlerFunction,
      isActive: true,
    });
  }

  private clone(manager: Map<string, ShortcutHandler>) {
    const managerClone = new Map<Shortcut, ShortcutHandler>();
    for (const [shortcut, handler] of manager) {
      managerClone.set(shortcut as Shortcut, {
        handlerFunction: handler.handlerFunction,
        isActive: handler.isActive,
      });
    }
    return managerClone;
  }

  push() {
    this.history.push(this.clone(this.manager));
  }

  pop() {
    const popped = this.history.pop();
    if (!!popped) {
      this.manager = popped;
    }
  }
}
