import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-color-pickler-item',
  templateUrl: './color-pickler-item.component.html',
  styleUrls: ['./color-pickler-item.component.scss']
})
export class ColorPicklerItemComponent implements AfterViewInit {

  @Input() color: string;

  @ViewChild('button', {
    read: ElementRef,
    static: false}
  ) button: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit() {
    this.updateColor(this.color);
    this.renderer.setStyle(this.button.nativeElement, 'border', '2px solid grey');
  }

  updateColor(color: string) {
    this.renderer.setStyle(this.button.nativeElement, 'background-color', color);
  }

}
