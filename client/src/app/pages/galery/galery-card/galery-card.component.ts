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
  @Input() svg: SVGSVGElement;
  @Input() tags: string[];
  @Input() id: number;

  @Output() load: Subject<number>;
  @Output() delete: Subject<number>;
  @Output() tagClick: Subject<string>;

  @ViewChild('svg', {
    static: false,
    read: ElementRef
  }) svgRef: ElementRef<HTMLElement>;

  constructor(private renderer: Renderer2) {
    this.load = new Subject();
    this.delete = new Subject();
    this.tagClick = new Subject();
  }

  ngAfterViewInit() {
    const svgWidth = this.svg.getAttribute('width');
    const svgHeight = this.svg.getAttribute('height');
    let viewPortWidth;
    let viewPortHeight;
    if (!!svgWidth && !!svgHeight) {
      const factor = Math.max(+svgWidth / 300, +svgHeight / 170);
      viewPortWidth = Number(svgWidth) / factor;
      viewPortHeight = Number(svgHeight) / factor;
      this.svg.setAttribute('width', viewPortWidth.toString());
      this.svg.setAttribute('height', viewPortHeight.toString());
    }
    this.svg.setAttribute('viewBox',
      [0, 0, svgWidth, svgHeight].join(' '));
    this.renderer.appendChild(this.svgRef.nativeElement, this.svg);
  }

  onLoad() {
    this.load.next(this.id);
  }

  onDelete() {
    this.delete.next(this.id);
  }

  onClick(tag: string) {
    console.log(tag);
    this.tagClick.next(tag)
  }
}
