import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  options = [
    {
      icon        : 'add',
      message     : 'Créer un nouveau dessin',
      routerLink  : 'new',
      canDisplay  : true
    },
    {
      icon        : 'photo_library',
      message     : 'Aller à la galerie',
      routerLink  : 'library',
      canDisplay  : true
    },
    {
      icon        : 'menu_book',
      message     : 'Guide d\'utilisation',
      routerLink  : 'documentation',
      canDisplay  : true
    },
    {
      icon        : 'save',
      message     : 'Continuer un ancien dessin',
      routerLink  : 'saved',
      canDisplay  : true
    }

  ]

}
