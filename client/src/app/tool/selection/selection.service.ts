import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  selectedElements: Set<SVGElement>;
  selectAllElements: EventEmitter<null>;

  constructor() {
    this.selectedElements = new Set();
    this.selectAllElements = new EventEmitter();
  }

}
