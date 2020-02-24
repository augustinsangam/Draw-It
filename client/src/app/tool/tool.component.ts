import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-tool',
  styleUrls: [
    './tool.component.css',
  ],
  templateUrl: './tool.component.html',
})
export class ToolComponent implements AfterViewInit {
  // Must be public
  @Output() width: EventEmitter<number>;

  constructor(
    protected readonly elementRef: ElementRef<HTMLElement>,
  ) {
    this.width = new EventEmitter();
  }

  // Must be public
  ngAfterViewInit() {
    // NOTE: offsetWidth does NOT include left/right margins
    this.width.emit(this.elementRef.nativeElement.offsetWidth);
  }
}
