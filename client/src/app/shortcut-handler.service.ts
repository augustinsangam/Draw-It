import { Injectable } from '@angular/core';

export enum Shortcut {
  C = 'KeyC',
  W = 'KeyW',
  L = 'KeyL',
  Digit1 = 'Digit1',
  O = 'KeyO',
}

export type KeybardCallback = (event?: KeyboardEvent) => void;

export interface Handler {
  handlerFunction: KeybardCallback;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ShortcutHandlerService {

  private manager: Map<Shortcut, Handler>;

  constructor() {
    this.manager = new Map();
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

  set(shortcut: Shortcut, handler: KeybardCallback): void {
    this.manager.set(shortcut, {
      handlerFunction: handler,
      isActive: true,
    });
  }
}