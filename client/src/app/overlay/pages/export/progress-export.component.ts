import { Component } from '@angular/core';

@Component({
  templateUrl: 'progress-export.component.html'
})
export class ProgressExportComponent {

  inProgress: boolean;
  message: string;
  error: boolean;

  constructor() {
    this.inProgress = true;
    this.error = false;
    this.message = 'En cours';
  }

}
