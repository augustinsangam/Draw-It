import { AfterViewInit, Component, ElementRef, ViewChild,  } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { HomeComponent } from './pages/home/home.component';
import { NewDrawComponent } from './pages/new-draw/new-draw.component';
import { Tool } from './tool/tool.enum';

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

  @ViewChild('panel', {
    static: false,
  }) panel: ElementRef<HTMLElement>;

  tool: Tool;

  toggle: boolean;

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
          console.log('On ouvre la documentation');
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

  createNewDraw(option: NewDrawOptions) {
    console.log('On crée le dessin');
  }
}
