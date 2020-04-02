import {
  AfterViewInit, Component, ElementRef, Input, Output, Renderer2, ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { GalleryDraw } from '../gallery.component';

const THUMBNAIL_WIDTH = 300;
const THUMBNAIL_HEIGHT = 170;
@Component({
  selector: 'app-gallery-card',
  templateUrl: './gallery-card.component.html',
  styleUrls: ['./gallery-card.component.scss']
})
export class GalleryCardComponent implements AfterViewInit {

  @Input() draw: GalleryDraw;

  @Output() load: Subject<number>;
  @Output() delete: Subject<number>;
  @Output() tagClick: Subject<string>;

  @ViewChild('svg', {
    static: false,
  }) svgRef: ElementRef<HTMLElement>;

  constructor(private renderer: Renderer2) {
    this.load = new Subject();
    this.delete = new Subject();
    this.tagClick = new Subject();
  }

  ngAfterViewInit(): void {
    let viewPortWidth;
    let viewPortHeight;
    if (!!this.draw.shape.width && !!this.draw.shape.height) {
      const factor = Math.max(
        +this.draw.shape.width / THUMBNAIL_WIDTH,
        +this.draw.shape.height / THUMBNAIL_HEIGHT
      );
      viewPortWidth = +this.draw.shape.width / factor;
      viewPortHeight = +this.draw.shape.height / factor;
      this.renderer.setAttribute(this.svgRef.nativeElement, 'width', viewPortWidth.toString());
      this.renderer.setAttribute(this.svgRef.nativeElement, 'height', viewPortHeight.toString());
    }
    this.renderer.setAttribute(this.svgRef.nativeElement, 'viewBox',
      [0, 0, this.draw.shape.width, this.draw.shape.height].join(' '));
    this.renderer.setStyle(this.svgRef.nativeElement, 'background-color', this.draw.shape.color);
    this.renderer.appendChild(this.svgRef.nativeElement, this.draw.svg);
  }

  protected onLoad(): void {
    this.load.next(this.draw.header.id);
  }

  protected onDelete(): void {
    this.delete.next(this.draw.header.id);
  }

  protected onClick(tag: string): void {
    this.tagClick.next(tag);
  }
}
