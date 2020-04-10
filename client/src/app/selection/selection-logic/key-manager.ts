import { KeyboardPressCallback } from './selection-logic-util';

export interface KeyManager {
  keyPressed: Set<string>;
  shift: boolean;
  alt: boolean;
  lastTimeCheck: number;
  handlers: {
    keydown: KeyboardPressCallback;
    keyup: KeyboardPressCallback;
  };
}
