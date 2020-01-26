import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedEvents, { MouseEv } from '../../shared-events';
import { ToolService } from '../tool.service';

@Injectable({
  providedIn: 'root'
})
export class BrushService extends ToolService {

  constructor() {
    super();
  }

  init(sharedEvents: SharedEvents): void {
    this.ngUnsubscribe = new Subject();
    sharedEvents.mouseEv$$[MouseEv.Down].pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(mouseEv => {
        console.log('Brush: ' + mouseEv.button);
      });
  }
}
