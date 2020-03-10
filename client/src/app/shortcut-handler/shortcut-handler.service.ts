import { Injectable } from '@angular/core';
import { Shortcut } from './shortcut';

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
    const handler = this.manager.get(event.key as Shortcut);

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
    this.manager.forEach((handler) => handler.isActive = true);
  }

  desactivateAll(): void {
    this.manager.forEach((handler) => handler.isActive = false);
  }

  set(shortcut: Shortcut, handler: ShortcutCallBack): void {
    this.manager.set(shortcut, {
      handlerFunction: handler,
      isActive: true,
    });
  }

  private clone(manager: Map<Shortcut, Handler>): Map<Shortcut, Handler> {
    const managerClone = new Map<Shortcut, Handler>();
    for (const [shortcut, handler] of manager) {
      managerClone.set(shortcut, {
        isActive: handler.isActive,
        handlerFunction: handler.handlerFunction
      });
    }
    return managerClone;
  }

  push(): void {
    this.history.push(this.clone(this.manager));
  }

  pop(): void {
    this.manager = this.history.pop() as Map<Shortcut, Handler>;
  }
}
