import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild
} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';

import {CommunicationService} from './communication/communication.service';
import {DocumentationComponent} from './pages/documentation/documentation.component';
import {HomeComponent} from './pages/home/home.component';
import {NewDrawComponent} from './pages/new-draw/new-draw.component';
import {
  Shortcut,
  ShortcutCallBack,
  ShortcutHandlerService
} from './shortcut-handler.service';
import {SvgService} from './svg/svg.service';
import {ColorService} from './tool/color/color.service';
import {ToolSelectorService} from './tool/tool-selector/tool-selector.service';
import {Tool} from './tool/tool.enum';

export interface NewDrawOptions {
  width: number;
  height: number;
  color: string;
}

export enum OverlayPages {
  Documentation = 'documentation',
  Home = 'home',
  Library = 'library',
  New = 'new'
}

export interface DialogRefs {
  home: MatDialogRef<HomeComponent>;
  newDraw: MatDialogRef<NewDrawComponent>;
  documentation: MatDialogRef<DocumentationComponent>;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  private dialogRefs: DialogRefs;
  private drawInProgress: boolean;
  protected drawOption: NewDrawOptions;

  @ViewChild('svg', {
    static: false,
    read: ElementRef
  })
  svg: ElementRef<SVGSVGElement>;

  handlersFunc: Map<Shortcut, ShortcutCallBack>;

  private getCommomDialogOptions = () => {
    return {
      width: '650px',
      height: '90%',
      data: { drawInProgress: this.drawInProgress }
    };
  };

  constructor(
    public dialog: MatDialog,
    private readonly communicationServerice: CommunicationService,
    private readonly toolSelectorService: ToolSelectorService,
    private colorService: ColorService,
    private svgService: SvgService,
    private shortcutHanler: ShortcutHandlerService
  ) {
    this.drawInProgress = false;
    this.drawOption = { height: 0, width: 0, color: '' };

    this.handlersFunc = new Map();
    this.handlersFunc.set(Shortcut.C, () =>
      this.toolSelectorService.set(Tool.Pencil)
    );
    this.handlersFunc.set(Shortcut.L, () =>
      this.toolSelectorService.set(Tool.Line)
    );
    this.handlersFunc.set(Shortcut.W, () =>
      this.toolSelectorService.set(Tool.Brush)
    );
    this.handlersFunc.set(Shortcut.Digit1, () =>
      this.toolSelectorService.set(Tool.Rectangle)
    );
    this.handlersFunc.set(Shortcut.Digit2, () =>
      this.toolSelectorService.set(Tool.Ellipse)
    );
    this.handlersFunc.set(Shortcut.Digit3, () =>
      this.toolSelectorService.set(Tool.Polygone)
    );
    this.handlersFunc.set(Shortcut.I, () =>
      this.toolSelectorService.set(Tool.Pipette)
  );
    this.handlersFunc.set(Shortcut.O, (event: KeyboardEvent) => {
      if (!!event && event.ctrlKey) {
        event.preventDefault();
        this.openNewDrawDialog();
      }
    });

    [
      Shortcut.C,
      Shortcut.L,
      Shortcut.W,
      Shortcut.Digit1,
      Shortcut.Digit2,
      Shortcut.O,
      Shortcut.I
    ].forEach(
      shortcut => {
        this.shortcutHanler.set(
          shortcut,
          this.handlersFunc.get(shortcut) as ShortcutCallBack
        );
      }
    );

    this.dialogRefs = {
      home: (undefined as unknown) as MatDialogRef<HomeComponent>,
      newDraw: (undefined as unknown) as MatDialogRef<NewDrawComponent>,
      documentation: (undefined as unknown) as MatDialogRef<
        DocumentationComponent
      >
    };
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.shortcutHanler.execute(event);
  }

  ngAfterViewInit() {
    this.svgService.instance = this.svg;
    this.openHomeDialog();
    setInterval(() => {
      this.communicationServerice.encode(
        'BEST DRAW EVER',
        ['rouge', 'licorne'],
        this.svgService.instance.nativeElement);
      this.communicationServerice.post()
        .then(id => console.log('SUCESS: ' + id))
        .catch(err => console.log('FAIL: ' + err));
    }, 2000);
  }

  private openHomeDialog(): void {
    this.dialogRefs.home = this.dialog.open(
      HomeComponent,
      this.getCommomDialogOptions()
    );
    this.dialogRefs.home.disableClose = true;
    this.shortcutHanler.desactivateAll();
    this.dialogRefs.home.afterClosed().subscribe((result: string) => {
      this.shortcutHanler.activateAll();
      this.openSelectedDialog(result);
    });
  }

  private openSelectedDialog(dialog: string): void {
    switch (dialog) {
      case OverlayPages.New:
        this.openNewDrawDialog();
        break;
      case OverlayPages.Library:
        break;
      case OverlayPages.Documentation:
        this.openDocumentationDialog(true);
        break;
      default:
        break;
    }
  }

  private openNewDrawDialog(): void {
    this.shortcutHanler.desactivateAll();
    this.dialogRefs.newDraw = this.dialog.open(
      NewDrawComponent,
      this.getCommomDialogOptions()
    );
    this.dialogRefs.newDraw.disableClose = true;
    this.dialogRefs.newDraw.afterClosed().subscribe(resultNewDialog => {
      this.shortcutHanler.activateAll();
      this.closeNewDrawDialog(resultNewDialog);
    });
  }

  private closeNewDrawDialog(option: string | NewDrawOptions): void {
    if (option === OverlayPages.Home) {
      this.openHomeDialog();
    } else if (option !== null) {
      this.createNewDraw(option as NewDrawOptions);
    }
  }

  private openDocumentationDialog(fromHome: boolean): void {
    const dialogOptions = {
      width: '115vw',
      height: '100vh',
      panelClass: 'documentation'
    };
    this.shortcutHanler.desactivateAll();
    this.dialogRefs.documentation = this.dialog.open(
      DocumentationComponent,
      dialogOptions
    );
    this.dialogRefs.documentation.disableClose = false;
    this.dialogRefs.documentation.afterClosed().subscribe(() => {
      this.shortcutHanler.activateAll();
      this.closeDocumentationDialog(fromHome);
    });
  }

  private closeDocumentationDialog(fromHome: boolean): void {
    if (fromHome) {
      this.openHomeDialog();
    }
  }

  private createNewDraw(option: NewDrawOptions): void {
    this.drawOption = option;
    this.drawInProgress = true;
    const rgb = this.colorService.hexToRgb(option.color);
    this.colorService.selectBackgroundColor(
      `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`
    );
    this.svgService.clearDom();
    this.toolSelectorService.set(Tool.Pencil);
    // Deuxième fois juste pour fermer le panneau latéral
    this.toolSelectorService.set(Tool.Pencil);
  }
}
