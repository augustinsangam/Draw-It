import { Injectable } from '@angular/core';

export enum Shortcut {
  C = 'KeyC',
  W = 'KeyW',
  L = 'KeyL',
  Digit1 = 'Digit1',
  Digit2 = 'Digit2',
  Digit3 = 'Digit3',
  O = 'KeyO',
  A = 'KeyA',
  S = 'KeyS',
  I = 'KeyI'
}

export type ShortcutCallBack = (event?: KeyboardEvent) => void;

export interface Handler {
  handlerFunction: ShortcutCallBack;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ShortcutHandlerService {

  private manager: Map<Shortcut, Handler>;
  private history: (Map<Shortcut, Handler>)[];

  constructor() {
    this.manager = new Map();
    this.history = [];
  }

  execute(event: KeyboardEvent): void {
    const handler = this.manager.get(event.code as Shortcut);

    if (!!handler && handler.isActive) {
      handler.handlerFunction(event);
    }
  }

  activate(shortcut: Shortcut): void {
    (this.manager.get(shortcut) as Handler).isActive = true;
  }

  desactivate(shortcut: Shortcut): void {
    (this.manager.get(shortcut) as Handler).isActive = false;
  }

  activateAll(): void {
    this.manager.forEach(handler => handler.isActive = true);
  }

  desactivateAll(): void {
    this.manager.forEach(handler => handler.isActive = false);
  }

  set(shortcut: Shortcut, handler: ShortcutCallBack): void {
    this.manager.set(shortcut, {
      handlerFunction: handler,
      isActive: true,
    });
  }

  private clone(manager: Map<Shortcut, Handler>) {
    const managerClone = new Map<Shortcut, Handler>();
    for (const [shortcut, handler] of manager) {
      managerClone.set(shortcut, {
        isActive: handler.isActive,
        handlerFunction: handler.handlerFunction
      });
    }
    return managerClone;
  }

  push() {
    this.history.push(this.clone(this.manager));
  }

  pop() {
    this.manager = this.history.pop() as Map<Shortcut, Handler>;
  }
}
