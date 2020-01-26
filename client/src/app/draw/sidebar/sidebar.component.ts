import { Component } from '@angular/core';

@Component({
  selector: 'draw-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Output() sharedEvents = new EventEmitter<>();

  constructor() {
  }
}
