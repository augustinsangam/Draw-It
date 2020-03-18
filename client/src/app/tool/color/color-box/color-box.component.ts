import { Component } from '@angular/core';

@Component({
  selector: 'app-color-box',
  templateUrl: './color-box.component.html',
  styleUrls: ['./color-box.component.scss']
})
export class ColorBoxComponent {

  protected isExpanded: boolean;

  constructor() {
    this.isExpanded = false;
  }

}
