import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MagnetPoint } from './magnet-point';

declare global {
    interface Array<T> {
      peak(): T ;
    }
}

Array.prototype.peak = function<T>(this: T[]): T {
  return this[this.length - 1];
};

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  selectedElements: Set<SVGElement>;
  clipboard: Set<SVGElement>[];

  selectAllElements: Subject<null>;
  copy: Subject<null>;
  cut: Subject<null>;
  paste: Subject<null>;
  duplicate: Subject<null>;
  delete: Subject<null>;

  magnetActive: boolean;
  magnetPoint: MagnetPoint;

  constructor() {
    this.selectedElements = new Set();
    this.clipboard = [];
    this.selectAllElements = new Subject();
    this.copy = new Subject();
    this.cut = new Subject();
    this.paste = new Subject();
    this.duplicate = new Subject();
    this.delete = new Subject();

    this.magnetActive = true;
    this.magnetPoint = MagnetPoint.Center;
  }

}
