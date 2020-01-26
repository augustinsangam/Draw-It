import { Observable } from 'rxjs';

export enum KeyboardEv {
  Down,
  Up,
  _Len,
}

export enum MouseEv {
  Down,
  Move,
  Up,
  _Len,
}

export interface SharedEvents {
  keyboardEv$$: Observable<KeyboardEvent>[],
  mouseEv$$: Observable<MouseEvent>[],
}
