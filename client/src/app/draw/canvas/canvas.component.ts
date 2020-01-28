import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'draw-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('sandbox', {
    static: false,
  }) sandbox: ElementRef<HTMLCanvasElement>;

  constructor() {
  }

  ngAfterViewInit() {
  }
}
