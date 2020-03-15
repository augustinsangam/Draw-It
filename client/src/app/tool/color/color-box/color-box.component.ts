import { Component, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-color-box',
  templateUrl: './color-box.component.html',
  styleUrls: ['./color-box.component.scss']
})
export class ColorBoxComponent {

  protected isExpanded: boolean;
  @Output() expandStatus: Subject<boolean>;

  constructor() {
    this.isExpanded = false;
    this.expandStatus = new Subject();
  }

  protected onClick(): void {
    this.isExpanded = !this.isExpanded;
    this.expandStatus.next(this.isExpanded);
  }

}
