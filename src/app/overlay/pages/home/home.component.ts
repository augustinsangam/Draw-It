import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface DialogData {
  drawInProgress: boolean;
}

interface Option {
  icon: string;
  message: string;
  dialogCloseResult: string;
  canDisplay: boolean;
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
        icon: 'publish',
        message: 'Ouvrir un projet',
        dialogCloseResult: 'open',
        canDisplay: true,
      },
      {
        icon: 'menu_book',
        message: 'Guide d\'utilisation',
        dialogCloseResult: 'documentation',
        canDisplay: true,
      },
      {
        icon: 'help_outline',
        message: 'À propos de Draw It',
        dialogCloseResult: 'about',
        canDisplay: true,
      }
    ];
    this.options[0].canDisplay = data.drawInProgress;
  }
}
