import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DocumentationComponent } from './pages/documentation/documentation.component';
import { HomeComponent } from './pages/home/home.component';
import { NewDrawComponent } from './pages/new-draw/new-draw.component';
import { ToolSelectorService } from './tool/tool-selector/tool-selector.service';
import { Tool } from './tool/tool.enum';
import { SvgService } from './svg/svg.service';

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
  private readonly toolSelector: Map<string, Tool> ;
  private onMainPage = false;
  drawInProgress = false;
  drawOption: NewDrawOptions = { height : 0, width : 0, color: ''};

  @ViewChild('svg', {
    static: false,
    read: ElementRef
  }) svg: ElementRef<SVGElement>;

  getCommomDialogOptions = () => {
    return {
      width: '650px',
      height: '90%',
      data: { drawInProgress: this.drawInProgress }
    };
  }

  constructor(public dialog: MatDialog, private readonly toolSelectorService: ToolSelectorService, private svgService: SvgService) {
    this.toolSelector = new Map()
    this.toolSelector.set('KeyC', Tool.Pencil);
    this.toolSelector.set('Digit1', Tool.Rectangle);
    this.toolSelector.set('KeyL', Tool.Line);
    this.toolSelector.set('KeyW', Tool.Brush);
   };

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.onMainPage) {
      if (this.toolSelector.has( event.code)) {
        const tool = this.toolSelector.get(event.code);
        this.toolSelectorService.set(tool as Tool);
      }
      if (event.code === 'KeyO' && event.ctrlKey) {
        event.preventDefault();
        this.openNewDrawDialog();
      }
    }
  }

  ngAfterViewInit() {
    this.svgService.istance = this.svg;
    this.openHomeDialog();
  }

  openHomeDialog() {
    const dialogRef = this.dialog.open(HomeComponent, this.getCommomDialogOptions());
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
    const newDialog = this.dialog.open(NewDrawComponent, this.getCommomDialogOptions());
    newDialog.disableClose = true;

    newDialog.afterClosed().subscribe((resultNewDialog) => {
      if (resultNewDialog === 'home') {
        this.openHomeDialog();
      } else if (resultNewDialog !== null) {
        this.createNewDraw(resultNewDialog);
        this.onMainPage = true;
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
    this.onMainPage = false;
    newDialog.afterClosed().subscribe((resultNewDialog) => {
      if (fromHome) {
        this.openHomeDialog();
      } else {
        this.onMainPage = true;
      }
    });
  }

  createNewDraw(option: NewDrawOptions) {
    this.drawOption = option;
    this.drawInProgress = true;
    const childrens = Array.from(this.svg.nativeElement.children)
    childrens.forEach(element => {
      element.remove();
    });
  }
}
