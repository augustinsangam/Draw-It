import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

import Picker from 'vanilla-picker';

@Component({
  selector: 'draw-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit {
  @ViewChild('colorpicker', {
    static: false,
  })
  figureEl: ElementRef<HTMLElement>;
  settings: string[];

  constructor() {
    this.settings = [
      'First',
      'Second',
      'Third',
    ];
  }

  ngAfterViewInit() {
    new Picker({
      parent: this.figureEl.nativeElement,
      popup: false,
      onChange: () => console.log('change'),
      onDone: () => console.log('done'),
    });
  }
}
