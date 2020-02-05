import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material';

import { DocumentationComponent } from './pages/documentation/documentation.component';
import { HomeComponent } from './pages/home/home.component';
import { NewDrawComponent } from './pages/new-draw/new-draw.component';
import { SvgService } from './svg/svg.service';
import { ColorService } from './tool/color/color.service';
import { ToolSelectorService } from './tool/tool-selector/tool-selector.service';
import { Tool } from './tool/tool.enum';

export interface NewDrawOptions {
  width: number;
  height: number;
  color: string;
}

export enum OverlayPages {
  Documentation = 'documentation',
  Home = 'home',
  Library = 'library',
  New = 'new',
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  private readonly toolSelector: Map<string, Tool> ;
  private onMainPage = false;
  private drawInProgress = false;
  protected drawOption: NewDrawOptions;

  @ViewChild('svg', {
    read: ElementRef,
    static: false,
  })
  private svg: ElementRef<SVGElement>;

  @HostListener('document:keydown', ['$event'])
  protected keyEvent(keyEv: KeyboardEvent) {
    if (this.onMainPage) {
      if (keyEv.ctrlKey) {
        if (keyEv.code === 'KeyO') {
          // TODO: Pourquoi?
          keyEv.preventDefault();
          this.openNewDrawDialog();
        }
      } else if (this.toolSelector.has(keyEv.code)) {
        const tool = this.toolSelector.get(keyEv.code);
        this.toolSelectorService.set(tool as Tool);
      }
    }
  }

  constructor(public dialog: MatDialog,
              private readonly toolSelectorService: ToolSelectorService,
              private colorService: ColorService,
              private svgService: SvgService) {
    this.toolSelector = new Map()
    this.toolSelector.set('Digit1', Tool.Rectangle);
    this.toolSelector.set('KeyL', Tool.Line);
    this.toolSelector.set('KeyC', Tool.Pencil);
    this.toolSelector.set('KeyW', Tool.Brush);
    this.drawOption = {
      color: '',
      height: 0,
      width : 0,
    };
   };

  ngAfterViewInit() {
    this.svgService.instance = this.svg;
    this.openHomeDialog();
  }

  private getCommomDialogOptions() {
    return {
      width: '650px',
      height: '90%',
      data: {
        drawInProgress: this.drawInProgress,
      },
    };
  }

  private openHomeDialog() {
    const dialogRef = this.dialog.open(HomeComponent, this.getCommomDialogOptions());
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      switch (result) {
        case OverlayPages.New:
          this.openNewDrawDialog();
          break;
        case OverlayPages.Library:
          console.log('On ouvre la librairie');
          break;
        case OverlayPages.Documentation:
          this.openDocumentationDialog(true);
          break;
        default:
          break;
      }
    });
  }

  private openNewDrawDialog() {
    const newDialog = this.dialog.open(NewDrawComponent, this.getCommomDialogOptions());
    newDialog.disableClose = true;

    newDialog.afterClosed().subscribe(resultNewDialog => {
      if (resultNewDialog === OverlayPages.Home) {
        this.openHomeDialog();
      } else if (resultNewDialog !== null) {
        this.createNewDraw(resultNewDialog);
        this.onMainPage = true;
      }
    });
  }

  private openDocumentationDialog(fromHome: boolean) {
    const dialogOptions = {
      width: '115vw',
      height: '100vh',
      panelClass: 'documentation',
    };
    const newDialog = this.dialog.open(DocumentationComponent, dialogOptions);
    newDialog.disableClose = false;
    this.onMainPage = false;
    newDialog.afterClosed().subscribe(() => {
      if (fromHome) {
        this.openHomeDialog();
      } else {
        this.onMainPage = true;
      }
    });
  }

  private createNewDraw(option: NewDrawOptions) {
    this.drawOption = option;
    this.drawInProgress = true;
    const rgb = this.colorService.hexToRgb(option.color);
    this.colorService.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
    // FIXME: Creer et detruire proprement le component au lieu de supprimer
    const childrens = Array.from(this.svg.nativeElement.children)
    childrens.forEach(el => el.remove());
  }
}
