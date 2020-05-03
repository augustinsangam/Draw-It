import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Output
} from '@angular/core';

@Directive({
  selector: 'app-tool-panel'
})
export abstract class ToolPanelDirective implements AfterViewInit {

  @Output() width: EventEmitter<number>;

  protected constructor(protected readonly elementRef: ElementRef<HTMLElement>) {
    this.width = new EventEmitter();
  }

  ngAfterViewInit(): void {
    this.width.emit(this.elementRef.nativeElement.offsetWidth);
  }
}
