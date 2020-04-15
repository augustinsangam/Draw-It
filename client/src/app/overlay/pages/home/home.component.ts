import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface DialogData {
  drawInProgress: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  private options: Option[];

  constructor(public dialogRef: MatDialogRef<HomeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.options = [
      {
        icon: 'save',
        message: 'Continuer le dernier dessin',
        dialogCloseResult: 'continue',
        canDisplay: true,
      },
      {
        icon: 'add',
        message: 'Nouveau dessin',
        dialogCloseResult: 'new',
        canDisplay: true,
      },
      {
        icon: 'photo_library',
        message: 'Galerie',
        dialogCloseResult: 'library',
        canDisplay: true,
      },
      {
        icon: 'menu_book',
        message: 'Guide d\'utilisation',
        dialogCloseResult: 'documentation',
        canDisplay: true,
      }
    ];
    this.options[0].canDisplay = data.drawInProgress;
  }
}

interface Option {
  icon: string;
  message: string;
  dialogCloseResult: string;
  canDisplay: boolean;
}
