import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

import Picker from 'vanilla-picker';

@Component({
  selector: 'draw-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('colorPicker', {
    static: false,
  })
  figureEl: ElementRef<HTMLElement>;
  settings: string[];
  private picker: Picker;

  constructor() {
    this.settings = [
      'First',
      'Second',
      'Third',
    ];
  }

  ngAfterViewInit() {
    this.picker = new Picker({
      parent: this.figureEl.nativeElement,
      popup: false,
      onChange: () => console.log('change'),
      onDone: () => console.log('done'),
    });
  }

  ngOnDestroy() {
    this.picker.destroy();
  }
}
