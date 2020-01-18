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
  private heart: Path2D;

  constructor(private hostEl: ElementRef,
              private resizeObserverService: ResizeObserverService) {
    this.paths = new Array<Path2D>();

    this.heart = new Path2D('M0 200 v-200 h200 a100,100 90 0,1 0,200 a100,100 90 0,1 -200,0 z');
  }

  ngOnInit() {
    const canvasCtx = this.canvasEl.nativeElement.getContext('2d');
    if (!!canvasCtx) {
      this.canvasCtx = canvasCtx;
    } else {
      alert('Context of canvas is null');
    }

    // width attribute is NOT the same as CSS’s width proprety
    // so on resize, update the attribute with to proprety width
    this.resizeObserverService.observe(this.hostEl.nativeElement);
      /*.subscribe(resizeObserverEntry => {
                 console.log(resizeObserverEntry)
                 this.resizeCanvasEl(resizeObserverEntry.contentBoxSize)});*/
    this.resizeCanvasEl({
      inlineSize: 1000,
      blockSize: 1000,
    });
  }

  resizeCanvasEl({inlineSize, blockSize}: ResizeObserverSize) {
    console.log(`${inlineSize} ${blockSize}`);
    this.canvasCtx.canvas.width = inlineSize;
    this.canvasCtx.canvas.height = blockSize;
    // Resizing canvas clear its content, so re-draw it
    this.drawOnCanvas();
  }

  drawOnCanvas() {
    this.canvasCtx.save();
    this.canvasCtx.translate(this.canvasCtx.canvas.width / 2,
                            this.canvasCtx.canvas.height / 2 + 50);
    this.canvasCtx.rotate(-.75 * Math.PI);
    this.canvasCtx.scale(.5, .5);
    this.canvasCtx.fillStyle = '#' + Math.floor(
      Math.random() * 0xFFFFFF).toString(16);
    this.canvasCtx.fill(this.heart);
    this.canvasCtx.restore();
    for (const path of this.paths) {
      if (!!path) {
        this.canvasCtx.fill(path);
      }
    }
  }
}
