import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  selectedElements: Set<SVGElement>;
  selectAllElements: EventEmitter<null>;

  clipboard: Set<SVGElement>;

  cut: EventEmitter<null>;

  paste: EventEmitter<null>;

  constructor() {
    this.selectedElements = new Set();
    this.selectAllElements = new EventEmitter();
    this.cut = new EventEmitter();
    this.paste = new EventEmitter();
  }

  onCopy(): void {
    this.clipboard = new Set(this.selectedElements);
  }

  onPaste(): void {
    this.paste.emit(null);
  }

  onCut(): void {
    this.cut.emit(null);
  }

}
