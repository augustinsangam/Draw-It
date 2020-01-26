import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import SharedEvents from '../shared-events';

@Injectable({
  providedIn: 'root'
})
export abstract class ToolService {
  protected ngUnsubscribe: Subject<unknown>;

  constructor() { }

  abstract init(sharedEvents: SharedEvents): void;

  dispose(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
