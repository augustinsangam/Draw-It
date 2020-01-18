import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ResizeObserverService, ResizeObserverSize } from '../../resize-observer.service';

@Component({
  selector: 'draw-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @ViewChild('canvas', {
    static: true,
  })
  canvasEl: ElementRef<HTMLCanvasElement>;
  private canvasCtx: CanvasRenderingContext2D;
  private paths: Path2D[];

  constructor(private hostEl: ElementRef,
              private resizeObserverService: ResizeObserverService) {
    this.paths = new Array<Path2D>();

    // TODO: Remove
    const p = new Path2D('M10 10 h 80 v 80 h -80 Z');
    this.paths.push(p);
  }

  ngOnInit() {
    const canvasCtx = this.canvasEl.nativeElement.getContext('2d');
    if (!!canvasCtx) {
      this.canvasCtx = canvasCtx;
    } else {
      alert('Context of canvas is null');
    }
    const p = new Path2D('M10 10 h 80 v 80 h -80 Z');
    this.canvasCtx.fill(p);

    // width attribute is NOT the same as CSS’s width proprety
    // so on resize, update the attribute with to proprety width
    this.resizeObserverService.observe(this.hostEl.nativeElement)
      .subscribe(resizeObserverEntry => {
                 console.log(resizeObserverEntry)
                 this.resizeCanvasEl(resizeObserverEntry.contentBoxSize)});
  }

  resizeCanvasEl({inlineSize, blockSize}: ResizeObserverSize) {
    console.log(`${inlineSize} ${blockSize}`);
    this.canvasCtx.canvas.width = inlineSize;
    this.canvasCtx.canvas.height = blockSize;
    // Resizing canvas clear its content, so re-draw it
    this.drawOnCanvas();
  }

  drawOnCanvas() {
    for (const path of this.paths) {
      if (!!path) {
        this.canvasCtx.fill(path);
      }
    }
  }
}
