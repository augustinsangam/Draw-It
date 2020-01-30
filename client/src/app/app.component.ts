import { AfterViewInit, Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { HomeComponent } from './pages/home/home.component';
import { NewDrawComponent } from './pages/new-draw/new-draw.component';
import { DocumentationComponent } from './pages/documentation/documentation.component';

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

  constructor(public dialog: MatDialog) {
  }

  ngAfterViewInit() {
    const dialogOptions = {
      width: '650px',
      height: '90%',
      data: { drawInProgress: this.drawInProgress }
    };
    this.openHomeDialog(dialogOptions);
  }

  openHomeDialog(dialogOptions: MatDialogConfig) {
    const dialogRef = this.dialog.open(HomeComponent, dialogOptions);
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result: string) => {
      switch (result) {
        case 'new':
          this.openNewDrawDialog(dialogOptions);
          break;
        case 'library':
          console.log('On ouvre la librairie');
          break;
        case 'documentation':
          this.openDocumentationDialog(dialogOptions);
          break;
        default:
          break;
      }
    });
  }

  openNewDrawDialog(dialogOptions: MatDialogConfig) {
    const newDialog = this.dialog.open(NewDrawComponent, dialogOptions);
    newDialog.disableClose = true;
    newDialog.afterClosed().subscribe((resultNewDialog) => {
      if (resultNewDialog === 'home') {
        this.openHomeDialog(dialogOptions);
      } else if (resultNewDialog !== null) {
        this.createNewDraw(resultNewDialog);
      }
    });
  }

  openDocumentationDialog(dialogOptions: MatDialogConfig) {
    dialogOptions.width = '90%';
    const newDialog = this.dialog.open(DocumentationComponent, dialogOptions);
    newDialog.disableClose = true;
    // newDialog.afterClosed().subscribe((resultNewDialog) => {
    //   if (resultNewDialog === 'home') {
    //     this.openHomeDialog(dialogOptions);
    //   } else if (resultNewDialog !== null) {
    //     this.createNewDraw(resultNewDialog);
    //   }
    // });
  }

  createNewDraw(option: NewDrawOptions) {
    console.log('On crée le dessin: ' + option);
  }
}
