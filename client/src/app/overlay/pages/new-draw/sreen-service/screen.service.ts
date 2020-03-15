import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Subject } from 'rxjs';

export const sideBarWidth = 68;

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  size: Subject<ScreenSize>;

  constructor(private eventManager: EventManager) {
    this.size = new Subject<ScreenSize>();
    this.eventManager.addGlobalEventListener(
      'window', 'resize', () => {
      this.onResize();
    });
  }

  getCurrentSize(): ScreenSize {
    return {
      height: innerHeight,
      width: innerWidth - sideBarWidth,
    };
  }

  onResize(): void {
    this.size.next(this.getCurrentSize());
  }
}

export interface ScreenSize {
  height: number;
  width: number;
}
