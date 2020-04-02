import { EventEmitter, Injectable } from '@angular/core';
import { MagnetPoint } from './magnet-point';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  selectedElements: Set<SVGElement>;
  clipboard: Set<SVGElement>;

  selectAllElements: EventEmitter<null>;
  copy: EventEmitter<null>;
  cut: EventEmitter<null>;
  paste: EventEmitter<null>;
  duplicate: EventEmitter<null>;
  delete: EventEmitter<null>;

  magnetActive: boolean;
  magnetPoint: MagnetPoint;

  constructor() {
    this.selectedElements = new Set();
    this.clipboard = new Set();
    this.selectAllElements = new EventEmitter();
    this.copy = new EventEmitter();
    this.cut = new EventEmitter();
    this.paste = new EventEmitter();
    this.duplicate = new EventEmitter();
    this.delete = new EventEmitter();

    this.magnetActive = true;
    this.magnetPoint = MagnetPoint.Center;
  }

}
