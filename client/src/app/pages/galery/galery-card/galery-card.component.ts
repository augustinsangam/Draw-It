import {
  AfterViewInit, Component, ElementRef, Input, Output, Renderer2, ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-galery-card',
  templateUrl: './galery-card.component.html',
  styleUrls: ['./galery-card.component.scss']
})
export class GaleryCardComponent implements AfterViewInit {

  @Input() name: string;
  @Input() svg: SVGGElement;
  @Input() tags: string[];
  @Input() id: number;
  @Input() height: number;
  @Input() width: number;
  @Input() color: string;

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

  ngAfterViewInit() {
    let viewPortWidth;
    let viewPortHeight;
    if (!!this.width && !!this.height) {
      const factor = Math.max(+this.width / 300, +this.height / 170);
      viewPortWidth = Number(this.width) / factor;
      viewPortHeight = Number(this.height) / factor;
      this.svgRef.nativeElement.setAttribute('width', viewPortWidth.toString());
      this.svgRef.nativeElement.setAttribute('height', viewPortHeight.toString());
    }
    this.svgRef.nativeElement.setAttribute('viewBox',
      [0, 0, this.width, this.height].join(' '));
    this.renderer.appendChild(this.svgRef.nativeElement, this.svg);
    console.log(this.svg);
  }

  onLoad() {
    this.load.next(this.id);
  }

  onDelete() {
    this.delete.next(this.id);
  }

  onClick(tag: string) {
    console.log(tag);
    this.tagClick.next(tag);
  }
}
