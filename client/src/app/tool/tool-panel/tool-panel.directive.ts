import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Output,
} from '@angular/core';

@Directive({
  selector: 'app-tool-panel',
})
export abstract class ToolPanelDirective implements AfterViewInit {
  // Must be public
  @Output() width: EventEmitter<number>;

  protected constructor(protected readonly elementRef: ElementRef<HTMLElement>) {
    this.width = new EventEmitter();
  }

  // Must be public
  ngAfterViewInit() {
    // NOTE: offsetWidth does NOT include left/right margins
    this.width.emit(this.elementRef.nativeElement.offsetWidth);
  }
}
