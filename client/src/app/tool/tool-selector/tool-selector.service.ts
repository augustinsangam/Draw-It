/*
  https://stackoverflow.com/a/41177163
 */

import { Injectable, OnDestroy } from '@angular/core';
// import { Observable, Subject } from 'rxjs';
import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';

import { Tool } from '../tool.enum';

@Injectable({
  providedIn: 'root'
})
export class ToolSelectorService implements OnDestroy {
  // private _tool: Tool;
  // private tool$: Observable<Tool>;
  private subject: Subject<Tool>;

  constructor() {
    this.subject = new Subject(); // BehaviorSubject(Tool._None)
    this.subject.subscribe(tool => console.log(`Tool #${tool} selected`));
    // this.tool = Tool._None;
  }

  ngOnDestroy() {
    this.subject.complete();
  }

  set(tool: Tool) {
    // NOTE: if (!!tool) DOES NOT WORK (first tool is zero, aka false)
    console.assert(tool != null);
    // this._tool = tool;
    // dispatch
    this.subject.next(tool);
  }

  listen(callback: (tool: Tool) => void) {
    // this.tool$.subscribe(callback);
    this.subject.subscribe(callback);
  }
}
