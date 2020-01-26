import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, merge, Observable } from 'rxjs';
import { distinctUntilChanged, filter, groupBy, map, mergeAll } from 'rxjs/operators';

import { KeyboardEv, MouseEv, SharedEvents } from '../utils';

@Component({
  selector: 'draw-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('sandbox', {
    static: false,
  })
  sandbox: ElementRef<HTMLCanvasElement>;
  sharedEvents: SharedEvents;

  constructor() {
    this.sharedEvents = {
      keyboardEv$$: new Array<Observable<KeyboardEvent>>(KeyboardEv._Len),
      mouseEv$$: new Array<Observable<MouseEvent>>(MouseEv._Len),
    };
  }

  ngAfterViewInit() {
    this.sharedEvents.keyboardEv$$[KeyboardEv.Down] =
      fromEvent<KeyboardEvent>(this.sandbox.nativeElement, 'keydown')
    this.sharedEvents.keyboardEv$$[KeyboardEv.Up] =
      fromEvent<KeyboardEvent>(this.sandbox.nativeElement, 'keyup');
    this.sharedEvents.mouseEv$$[MouseEv.Down] =
      fromEvent<MouseEvent>(this.sandbox.nativeElement, 'mousedown');
    this.sharedEvents.mouseEv$$[MouseEv.Move] =
      fromEvent<MouseEvent>(this.sandbox.nativeElement, 'mousemove');
    this.sharedEvents.mouseEv$$[MouseEv.Up] =
      fromEvent<MouseEvent>(this.sandbox.nativeElement, 'mouseup');

    merge(this.sharedEvents.keyboardEv$$[KeyboardEv.Up],
         this.sharedEvents.keyboardEv$$[KeyboardEv.Down]).pipe(
      filter(ev => !this.keys.has(ev.key)),
      groupBy(ev => ev.key),
      map(group => group.pipe(distinctUntilChanged(null, ev => ev.type))),
      mergeAll());

  }
}
