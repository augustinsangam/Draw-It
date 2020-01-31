import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';

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

  drawInProgress = false;

  @ViewChild('main', {
    static : false
  }) main: ElementRef<HTMLElement>;

  private svgRef: ElementRef<SVGElement>;

  constructor(public dialog: MatDialog,
              private renderer: Renderer2) {
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
    if (!this.drawInProgress) {
      this.svgRef = this.renderer.createElement('svg');
      this.renderer.setStyle(this.svgRef, 'height', `${option.height}px`);
      this.renderer.setStyle(this.svgRef, 'width', `${option.width}px`);
      this.renderer.setStyle(this.svgRef, 'background-color', option.color);
      this.renderer.appendChild(this.main.nativeElement, this.svgRef);
      this.drawInProgress = true;
    } else {
      this.renderer.removeChild(this.main, this.svgRef);
      this.svgRef = this.renderer.createElement('svg');
      this.renderer.setStyle(this.svgRef, 'height', `${option.height}px`);
      this.renderer.setStyle(this.svgRef, 'width', `${option.width}px`);
      this.renderer.setStyle(this.svgRef, 'background-color', option.color);
      this.renderer.appendChild(this.main.nativeElement, this.svgRef);
    }
  }
}
