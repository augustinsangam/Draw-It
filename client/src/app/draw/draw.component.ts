import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import SharedEvents from './shared-events';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})
export class DrawComponent implements AfterViewInit {
  @ViewChild('panel', {
    static: false,
  })
  panel: ElementRef<HTMLElement>;
  sharedEvents: SharedEvents;
  toggle: boolean;

  constructor() {
    this.toggle = false;
  }

  ngAfterViewInit() {
    console.log(this.sharedEvents);
  }
}
