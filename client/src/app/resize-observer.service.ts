import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResizeObserverService implements OnDestroy {
  private readonly map: WeakMap<Element, Observer<ResizeObserverEntry>>;
  private readonly resizeObserver: ResizeObserver;

  constructor() {
    if (!ResizeObserver) {
      alert('Fureteur obsolète! Continuez à votre discrétion.');
      // FIXME: Debate on how to handle this situation
      throw new Error('ResizeObserver not supported, upgrade your browser');
    }
    this.map = new WeakMap();
    this.resizeObserver = new ResizeObserver((entries, _resizeObserver) => {
      for (const entry of entries) {
        // TODO: TypeScript 3.7 Optional Chaining
        // ?.next(entry);
        const maybe = this.map.get(entry.target);
        if (!!maybe) {
          maybe.next(entry);
        }
      }
    });
  }

  ngOnDestroy() {
    // Unobserves all
    this.resizeObserver.disconnect();
  }

  observe(el: Element): Observable<ResizeObserverEntry> {
    return new Observable(observer => {
      this.map.set(el, observer);
      this.resizeObserver.observe(el);
      return () => this.map.delete(el) && this.resizeObserver.unobserve(el);
    });
  }
}

/******************************************************************************/
// Resources:
//  https://stackblitz.com/edit/angular-resize-observer
//  https://stackblitz.com/edit/rxjs-resize-observable
// NOTE: supports Firefox>=69 and Chrome>=64 only
// Polyfills are borken:
//  https://github.com/que-etc/resize-observer-polyfill/issues/53
//  https://github.com/juggle/resize-observer/pull/52
// So we use external declaration:
//  https://gist.github.com/strothj/708afcf4f01dd04de8f49c92e88093c3
// Until it gets into lib.dom.ts:
//  https://github.com/Microsoft/TypeScript/issues/28502
export interface ResizeObserverSize {
  inlineSize: number; // width
  blockSize: number;  // heieght
}
interface ResizeObserverEntry {
  readonly borderBoxSize: ResizeObserverSize;
  readonly contentBoxSize: ResizeObserverSize;
  readonly contentRect: DOMRectReadOnly;
  readonly target: Element;
}
type ResizeObserverCallback = (
  entries: ResizeObserverEntry[],
  observer: ResizeObserver,
) => void;
interface ResizeObserverObserveOptions {
  box?: 'content-box' | 'border-box';
}
declare class ResizeObserver {
  constructor(callback: ResizeObserverCallback);
  disconnect: () => void;
  observe: (target: Element, options?: ResizeObserverObserveOptions) => void;
  unobserve: (target: Element) => void;
}
/******************************************************************************/
