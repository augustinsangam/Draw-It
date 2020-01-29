import { Component, ElementRef, ViewChild } from '@angular/core';
import { Tool } from './tool/tool.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    @ViewChild('panel', {
      static: false,
    }) panel: ElementRef<HTMLElement>;
    tool: Tool;
    toggle: boolean;

  constructor() {

  }
}
