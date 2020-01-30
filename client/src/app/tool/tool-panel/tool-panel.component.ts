import { AfterViewInit, Component, ElementRef, EventEmitter,
  Output } from '@angular/core';

@Component({
  selector: 'app-tool-panel',
  templateUrl: './tool-panel.component.html',
  styleUrls: ['./tool-panel.component.scss']
})
export abstract class ToolPanelComponent implements AfterViewInit {
  @Output() width: EventEmitter<number>;

  constructor(protected readonly elementRef: ElementRef<HTMLElement>) {
    this.width = new EventEmitter();
  }

  ngAfterViewInit() {
    // NOTE: offsetWidth does NOT include left/right margins
    this.width.emit(this.elementRef.nativeElement.offsetWidth);
  }
}
