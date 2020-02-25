import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Page } from '../page';

interface Entry {
  icon: string;
  message: string;
  result: Page;
  visible: boolean;
}

interface DialogData {
  drawInProgress: boolean;
}

@Component({
  selector: 'app-home',
  styleUrls: [
    './home.component.css',
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  // Must be public
  entries: Entry[];

  constructor(@Inject(MAT_DIALOG_DATA) dialogData: DialogData) {
    this.entries = [
      {
        icon    : 'add',
        message : 'Nouveau dessin',
        result  : Page.NEW_DRAW,
        visible : true,
      },
      {
        icon    : 'photo_library',
        message : 'Galerie',
        result  : Page.GALLERY,
        visible : true,
      },
      {
        icon    : 'menu_book',
        message : 'Guide d’utilisation',
        result  : Page.DOCUMENTATION,
        visible : true,
      },
      {
        icon    : 'save',
        message : 'Continuer le dernier dessin',
        result  : Page.MAIN,
        visible : dialogData.drawInProgress,
      },
    ];
  }
}
