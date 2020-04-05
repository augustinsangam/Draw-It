import { Injectable } from '@angular/core';
import { MagnetPoint } from './magnet-point';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  selectedElements: Set<SVGElement>;
  clipboard: Set<SVGElement>;

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
    this.clipboard = new Set();
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
