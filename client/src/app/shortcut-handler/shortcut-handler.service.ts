import { Injectable } from '@angular/core';

export enum Shortcut {
  A = 'KeyA',
  C = 'KeyC',
  E = 'KeyE',
  L = 'KeyL',
  O = 'KeyO',
  S = 'KeyS',
  W = 'KeyW',
  Z = 'KeyZ',
  _1 = 'Digit1',
  _2 = 'Digit2',
  _3 = 'Digit3',
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
  private readonly history: Map<Shortcut, ShortcutHandler>[];
  private manager: Map<Shortcut, ShortcutHandler>;

  constructor() {
    this.history = new Array();
    this.manager = new Map();
  }

  execute(keyEv: KeyboardEvent): void {
    const shortcut = keyEv.code as Shortcut;
    if (this.manager.has(shortcut)) {
      const shortcutHandler = this.manager.get(shortcut);
      if (shortcutHandler.isActive) {
        shortcutHandler.handlerFunction(keyEv);
      }
    }
  }

  activate(shortcut: Shortcut): void {
    (this.manager.get(shortcut) as ShortcutHandler).isActive = true;
  }

  desactivate(shortcut: Shortcut): void {
    (this.manager.get(shortcut) as ShortcutHandler).isActive = false;
  }

  activateAll(): void {
    this.manager.forEach((handler) => handler.isActive = true);
  }

  desactivateAll(): void {
    this.manager.forEach((handler) => handler.isActive = false);
  }

  set(shortcut: Shortcut, handler: ShortcutHandlerCallBack): void {
    this.manager.set(shortcut, {
      handlerFunction: handler,
      isActive: true,
    });
  }

  private clone(manager: Map<Shortcut, ShortcutHandler>) {
    const managerClone = new Map<Shortcut, ShortcutHandler>();
    for (const [shortcut, handler] of manager) {
      managerClone.set(shortcut, {
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
    this.manager = this.history.pop();
  }
}
