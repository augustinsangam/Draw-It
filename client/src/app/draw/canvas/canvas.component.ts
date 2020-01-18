import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'draw-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @ViewChild('canvas', {
    static: true,
  })
  canvas: ElementRef<HTMLCanvasElement>;
  private canvasCtx: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit() {
    const canvasCtx = this.canvas.nativeElement.getContext('2d');
    if (!!canvasCtx) {
      this.canvasCtx = canvasCtx;
    } else {
      alert('Context of canvas is null');
    }
    const p = new Path2D('M10 10 h 80 v 80 h -80 Z');
    this.canvasCtx.fill(p);
  }

}
