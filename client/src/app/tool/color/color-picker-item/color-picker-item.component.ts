import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-color-picker-item',
  styleUrls: [
    './color-picker-item.component.css',
  ],
  templateUrl: './color-picker-item.component.html',
})
export class ColorPickerItemComponent implements AfterViewInit {
  @Input() color: string;

  @ViewChild('button', {
    read: ElementRef,
    static: false,
  })
  button: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.updateColor(this.color);
    this.renderer.setStyle(
      this.button.nativeElement,
      'border',
      '2px solid grey'
    );
  }

  updateColor(color: string): void {
    this.renderer.setStyle(
      this.button.nativeElement,
      'background-color',
      color
    );
  }
}
