import { AfterViewInit, Component, ElementRef, EventEmitter, Output,
  ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';

import SharedEvents, { KeyboardEv, MouseEv } from '../shared-events';

@Component({
  selector: 'draw-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('sandbox', {
    static: false,
  }) sandbox: ElementRef<HTMLCanvasElement>;
  @Output() sharedEvents: EventEmitter<SharedEvents>;

  constructor() {
    this.sharedEvents = new EventEmitter<SharedEvents>();
  }

  ngAfterViewInit() {
    const keyboardEv$$ = new Array<Observable<KeyboardEvent>>(KeyboardEv._Len);
    const mouseEv$$ = new Array<Observable<MouseEvent>>(MouseEv._Len);

    keyboardEv$$[KeyboardEv.Down] =
      fromEvent<KeyboardEvent>(this.sandbox.nativeElement, 'keydown')
    keyboardEv$$[KeyboardEv.Up] =
      fromEvent<KeyboardEvent>(this.sandbox.nativeElement, 'keyup');
    mouseEv$$[MouseEv.Down] =
      fromEvent<MouseEvent>(this.sandbox.nativeElement, 'mousedown');
    mouseEv$$[MouseEv.Move] =
      fromEvent<MouseEvent>(this.sandbox.nativeElement, 'mousemove');
    mouseEv$$[MouseEv.Up] =
      fromEvent<MouseEvent>(this.sandbox.nativeElement, 'mouseup');

    this.sharedEvents.emit({
      keyboardEv$$,
      mouseEv$$,
    });

    // stackoverflow.com/a/41177163
    // stackoverflow.com/a/55474483
    // stackoverflow.com/a/44186764
    /*
import { distinctUntilChanged, filter, groupBy, map, mergeAll } from 'rxjs/operators';
      merge(this.sharedEvents.keyboardEv$$[KeyboardEv.Up],
         this.sharedEvents.keyboardEv$$[KeyboardEv.Down]).pipe(
      filter(() => true), // !this.keys.has(ev.key)),
      groupBy(ev => ev.key),
      map(group => group.pipe(distinctUntilChanged((x, y) => x.type == y.type))),
      mergeAll()).subscribe(a => console.log(a));*/
  }
}
