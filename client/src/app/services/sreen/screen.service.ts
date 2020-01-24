import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  size: Subject<ScreenSize>;

  constructor() {
    this.size = new Subject<ScreenSize>();
    addEventListener('resize', this.onResize.bind(this));
  }

  getCurrentSize(): ScreenSize {
    return {
      height: innerHeight,
      width: innerWidth,
    }
  }

  getSize(): Subject<ScreenSize> {
    return this.size;
  }

  onResize($event: Event) {
    this.size.next(this.getCurrentSize());
  }
}

export interface ScreenSize {
  height: number;
  width: number;
}