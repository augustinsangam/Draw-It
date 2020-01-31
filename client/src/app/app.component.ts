import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DocumentationComponent } from './pages/documentation/documentation.component';
import { HomeComponent } from './pages/home/home.component';
import { NewDrawComponent } from './pages/new-draw/new-draw.component';

export interface NewDrawOptions {
  width: number;
  height: number;
  color: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  drawInProgress = true;

  commonDialogOptions = {
    width: '650px',
    height: '90%',
    data: { drawInProgress: this.drawInProgress }
  };

  constructor(public dialog: MatDialog) {
  }

  ngAfterViewInit() {
    this.openHomeDialog();
  }

  openHomeDialog() {
    const dialogRef = this.dialog.open(HomeComponent, this.commonDialogOptions);
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result: string) => {
      switch (result) {
        case 'new':
          this.openNewDrawDialog();
          break;
        case 'library':
          console.log('On ouvre la librairie');
          break;
        case 'documentation':
          this.openDocumentationDialog(true);
          break;
        default:
          break;
      }
    });
  }

  openNewDrawDialog() {
    const newDialog = this.dialog.open(NewDrawComponent, this.commonDialogOptions);
    newDialog.disableClose = true;
    newDialog.afterClosed().subscribe((resultNewDialog) => {
      if (resultNewDialog === 'home') {
        this.openHomeDialog();
      } else if (resultNewDialog !== null) {
        this.createNewDraw(resultNewDialog);
      }
    });
  }

  openDocumentationDialog(fromHome: boolean) {
    const dialogOptions = {
      width: '115vw',
      height: '100vh',
      panelClass: 'documentation',
    };
    const newDialog = this.dialog.open(DocumentationComponent, dialogOptions);
    newDialog.disableClose = false;

    newDialog.afterClosed().subscribe((resultNewDialog) => {
      if (fromHome) {
        this.openHomeDialog();
      }
    });
  }

  createNewDraw(option: NewDrawOptions) {
    console.log('On crée le dessin: ' + option);
  }
}
