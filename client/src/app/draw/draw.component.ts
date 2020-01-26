import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

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
  toggle: boolean;

  constructor() {
    this.toggle = false;
  }

  ngAfterViewInit() {

  }
}
