import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Subject } from 'rxjs';

export interface ScreenSize {
  height: number;
  width: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {
  size: Subject<ScreenSize>;
  readonly sideBarWidth = 44;

  constructor(private eventManager: EventManager) {
    this.size = new Subject<ScreenSize>();
    this.eventManager.addGlobalEventListener(
      'window', 'resize', ($event: Event) => {
      this.onResize();
    });
  }

  getCurrentSize(): ScreenSize {
    return {
      height: innerHeight,
      width: innerWidth - this.sideBarWidth,
    };
  }

  onResize(): void {
    this.size.next(this.getCurrentSize());
  }
}
