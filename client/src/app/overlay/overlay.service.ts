import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from '@angular/material';
import {
  Shortcut, ShortcutHandlerService
} from '../shortcut-handler/shortcut-handler.service';
import { SvgService, SvgShape } from '../svg/svg.service';
import { ColorService } from '../tool/color/color.service';
import {
  ToolSelectorService
} from '../tool/tool-selector/tool-selector.service';
import { Tool } from '../tool/tool.enum';
import { OverlayPages } from './overlay-pages';
import {
  DocumentationComponent
} from './pages/documentation/documentation.component';
import { ExportComponent } from './pages/export/export.component';
import { GaleryComponent, GaleryDraw } from './pages/galery/galery.component';
import { HomeComponent } from './pages/home/home.component';
import { NewDrawComponent } from './pages/new-draw/new-draw.component';
import { SaveComponent } from './pages/save/save.component';

const CONSTANTS = {
  SUCCES_DURATION : 2000,
  FAILURE_DURATION : 2000,
};

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  private dialog: MatDialog;
  private dialogRefs: DialogRefs;
  private svgService: SvgService;

  constructor(private shortcutHanler: ShortcutHandlerService,
              private colorService: ColorService,
              private toolSelectorService: ToolSelectorService,
              private readonly snackBar: MatSnackBar,
  ) {

    this.shortcutHanler.set(Shortcut.O, (event: KeyboardEvent) => {
      if (!!event && event.ctrlKey) {
        event.preventDefault();
        this.openNewDrawDialog();
      }
    });

    this.shortcutHanler.set(Shortcut.A, (event: KeyboardEvent) => {
      if (!!event && event.ctrlKey) {
        event.preventDefault();
        this.toolSelectorService.set(Tool.Selection);
        this.toolSelectorService.set(Tool.Selection); // To close the pannel
        this.svgService.selectAllElements.emit(null);
      } else if (!!event && !event.ctrlKey) {
        this.toolSelectorService.set(Tool.Aerosol);
      }
    });
  }

  intialise(dialog: MatDialog, svgService: SvgService): void {
    this.dialog = dialog;
    this.dialogRefs = {
      home: (undefined as unknown) as MatDialogRef<HomeComponent>,
      newDraw: (undefined as unknown) as MatDialogRef<NewDrawComponent>,
      documentation: (undefined as unknown) as
        MatDialogRef<DocumentationComponent>,
      export: (undefined as unknown) as MatDialogRef<ExportComponent>,
      galery: (undefined as unknown) as MatDialogRef<GaleryComponent>,
      save: (undefined as unknown) as MatDialogRef<SaveComponent>,
    };
    this.svgService = svgService;
  }

  start(): void {
    this.openHomeDialog();
  }

  private openHomeDialog(closable: boolean = false): void {
    this.dialogRefs.home = this.dialog.open(
      HomeComponent,
      this.getCommomDialogOptions()
    );
    this.dialogRefs.home.disableClose = !closable;
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
        this.openGaleryDialog(true);
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
    this.dialogRefs.newDraw.afterClosed().subscribe((resultNewDialog: string | SvgShape) => {
      this.shortcutHanler.activateAll();
      this.closeNewDrawDialog(resultNewDialog);
    });
  }

  private closeNewDrawDialog(option: string | SvgShape): void {
    if (option === OverlayPages.Home) {
      this.openHomeDialog();
    } else if (option !== null) {
      this.createNewDraw(option as SvgShape);
    }
  }

  openDocumentationDialog(fromHome: boolean): void {
    const dialogOptions: MatDialogConfig = {
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

  openExportDialog(): void {
    const dialogOptions = {
      width: '1000px',
      height: '90vh'
    };
    this.shortcutHanler.desactivateAll();
    this.dialogRefs.export = this.dialog.open(
      ExportComponent,
      dialogOptions
    );
    this.dialogRefs.export.disableClose = true;
    this.dialogRefs.export.afterClosed().subscribe(() => {
      this.shortcutHanler.activateAll();
    });

  }

  openSaveDialog(): void {
    const dialogOptions = {
      width: '1000px',
      height: '90vh'
    };
    this.shortcutHanler.desactivateAll();
    this.dialogRefs.save = this.dialog.open(SaveComponent, dialogOptions);
    this.dialogRefs.save.disableClose = true;
    this.dialogRefs.save.afterClosed().subscribe((error?: string) => {
      this.shortcutHanler.activateAll();
      this.snackBar.open(error ? error : 'Succès', 'Ok', {
        duration: error ? CONSTANTS.SUCCES_DURATION : CONSTANTS.FAILURE_DURATION,
      });
    });
  }

  private closeDocumentationDialog(fromHome: boolean): void {
    if (fromHome) {
      this.openHomeDialog();
    }
  }

  openGaleryDialog(fromHome: boolean): void {
    const dialogOptions: MatDialogConfig = {
      width: '115vw',
      height: '100vh',
      panelClass: 'galery',
      data: { drawInProgress: this.svgService.drawInProgress },
    };
    this.shortcutHanler.desactivateAll();
    this.dialogRefs.galery = this.dialog.open(
      GaleryComponent,
      dialogOptions,
    );
    this.dialogRefs.galery.disableClose = false;
    this.dialogRefs.galery.afterClosed().subscribe((option) => {
      this.shortcutHanler.activateAll();
      this.closeGaleryDialog(fromHome, option);
    });
  }

  private closeGaleryDialog(
      fromHome: boolean,
      option: GaleryDraw | undefined): void {
    if (fromHome) {
      if (!!option) {
        this.loadDraw(option);
      } else {
        this.openHomeDialog();
      }
    } else if (!!option) {
      this.loadDraw(option);
    }
  }

  private createNewDraw(shape: SvgShape): void {
    this.svgService.shape = shape;
    const rgb = this.colorService.hexToRgb(shape.color);
    this.colorService.selectBackgroundColor(
      `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`
    );
    this.svgService.clearDom();
    this.toolSelectorService.set(Tool.Pencil);
    // Deuxième fois juste pour fermer le panneau latéral
    this.toolSelectorService.set(Tool.Pencil);
  }

  private loadDraw(draw: GaleryDraw): void {
    this.svgService.clearDom();
    this.svgService.shape = {
      height: draw.height,
      width: draw.width,
      color: draw.backgroundColor
    };
    Array.from(draw.svg.children).forEach((element: SVGGElement) => {
      this.svgService.structure.drawZone.appendChild(element);
    });
  }

  private getCommomDialogOptions(): MatDialogConfig {
    return {
      width: '650px',
      height: '90%',
      data: { drawInProgress: this.svgService.drawInProgress }
    };
  }
}

interface DialogRefs {
  home: MatDialogRef<HomeComponent>;
  newDraw: MatDialogRef<NewDrawComponent>;
  documentation: MatDialogRef<DocumentationComponent>;
  export: MatDialogRef<ExportComponent>;
  galery: MatDialogRef<GaleryComponent>;
  save: MatDialogRef<SaveComponent>;
}
