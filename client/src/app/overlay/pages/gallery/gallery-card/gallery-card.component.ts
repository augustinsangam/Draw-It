import {
  AfterViewInit, Component, ElementRef, Input, Output, Renderer2, ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { GalleryDraw } from '../gallery.component';

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
      const factor = Math.max(+this.draw.shape.width / 300, +this.draw.shape.height / 170);
      viewPortWidth = Number(this.draw.shape.width) / factor;
      viewPortHeight = Number(this.draw.shape.height) / factor;
      this.svgRef.nativeElement.setAttribute('width', viewPortWidth.toString());
      this.svgRef.nativeElement.setAttribute('height', viewPortHeight.toString());
    }
    this.svgRef.nativeElement.setAttribute('viewBox',
      [0, 0, this.draw.shape.width, this.draw.shape.height].join(' '));
    this.svgRef.nativeElement.style.backgroundColor = this.draw.shape.color;
    this.renderer.appendChild(this.svgRef.nativeElement, this.draw.svg);
  }

  onLoad(): void {
    this.load.next(this.draw.header.id);
  }

  onDelete(): void {
    this.delete.next(this.draw.header.id);
  }

  onClick(tag: string): void {
    this.tagClick.next(tag);
  }
}
