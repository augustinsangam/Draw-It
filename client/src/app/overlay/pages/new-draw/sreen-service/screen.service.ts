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
export class ScreenService {

  private static readonly SIDEBAR_WIDTH: number = 68;

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
      width: innerWidth - ScreenService.SIDEBAR_WIDTH,
    };
  }

  onResize(): void {
    this.size.next(this.getCurrentSize());
  }
}
