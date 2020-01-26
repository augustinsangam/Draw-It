import { Component } from '@angular/core';

@Component({
  selector: 'draw-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent {
  settings: string[];

  constructor() {
    this.settings = [
      'First',
      'Second',
      'Third',
    ];
  }
}
