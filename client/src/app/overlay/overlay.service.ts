import {
  Injectable
} from '@angular/core';
import {
  MatDialogConfig,
  MatDialogRef,
  MatSnackBar
} from '@angular/material';
import {
  SvgShape
} from '../svg/svg-shape';
import {
  SvgService
} from '../svg/svg.service';
import {
  ColorService
} from '../tool/color/color.service';
import {
  GridService
} from '../tool/grid/grid.service';
import {
  ToolSelectorService
} from '../tool/tool-selector/tool-selector.service';
import {
  Tool
} from '../tool/tool.enum';
import {
  UndoRedoService
} from '../tool/undo-redo/undo-redo.service';
import {
  OverlayManager
} from './overlay-manager';
import {
  OverlayPages
} from './overlay-pages';
import {
  DocumentationComponent
} from './pages/documentation/documentation.component';
import {
  ExportComponent
} from './pages/export/export.component';
import {
  GalleryComponent,
  GalleryDraw
} from './pages/gallery/gallery.component';
import {
  HomeComponent
} from './pages/home/home.component';
import {
  NewDrawComponent
} from './pages/new-draw/new-draw.component';
import {
  SaveComponent
} from './pages/save/save.component';
import { LocalStorageHandlerService } from '../auto-save/local-storage-handler.service';

interface DialogRefs {
  home: MatDialogRef<HomeComponent>;
  newDraw: MatDialogRef<NewDrawComponent>;
  documentation: MatDialogRef<DocumentationComponent>;
  export: MatDialogRef<ExportComponent>;
  gallery: MatDialogRef<GalleryComponent>;
  save: MatDialogRef<SaveComponent>;
}

const CONSTANTS = {
  SUCCES_DURATION: 2000,
  FAILURE_DURATION: 2020,
  LOAD_DURATION: 500,
};

const exportSaveDialogOptions: MatDialogConfig = {
  width: '1000px',
  height: '90vh'
};

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  private dialog: OverlayManager;
  private dialogRefs: DialogRefs;
  private svgService: SvgService;

  constructor(private colorService: ColorService,
              private toolSelectorService: ToolSelectorService,
              private readonly snackBar: MatSnackBar,
              private undoRedo: UndoRedoService,
              private gridService: GridService,
              private autoSave: LocalStorageHandlerService
  ) {
  }

  intialise(dialog: OverlayManager, svgService: SvgService): void {
    this.dialog = dialog;
    this.dialogRefs = {
      home: (undefined as unknown) as MatDialogRef<HomeComponent>,
      newDraw: (undefined as unknown) as MatDialogRef<NewDrawComponent>,
      documentation: (undefined as unknown) as
        MatDialogRef<DocumentationComponent>,
      export: (undefined as unknown) as MatDialogRef<ExportComponent>,
      gallery: (undefined as unknown) as MatDialogRef<GalleryComponent>,
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
      this.getCommonDialogOptions()
    );
    this.dialogRefs.home.disableClose = !closable;
    this.dialogRefs.home.afterClosed().subscribe((result: string) => {
      this.openSelectedDialog(result);
    });
  }

  private openSelectedDialog(dialog: string): void {
    switch (dialog) {
      case OverlayPages.New:
        this.openNewDrawDialog();
        break;
      case OverlayPages.Library:
        this.openGalleryDialog(true);
        break;
      case OverlayPages.Documentation:
        this.openDocumentationDialog(true);
        break;
      default:
        break;
    }
  }

  openNewDrawDialog(): void {
    this.dialogRefs.newDraw = this.dialog.open(
      NewDrawComponent,
      this.getCommonDialogOptions()
    );
    this.dialogRefs.newDraw.disableClose = true;
    this.dialogRefs.newDraw.afterClosed().subscribe(
      (resultNewDialog: string | SvgShape) => {
        this.closeNewDrawDialog(resultNewDialog);
      }
    );
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
    this.dialogRefs.documentation = this.dialog.open(
      DocumentationComponent,
      dialogOptions
    );
    this.dialogRefs.documentation.disableClose = false;
    this.dialogRefs.documentation.afterClosed().subscribe(() => {
      this.closeDocumentationDialog(fromHome);
    });
  }

  openExportDialog(): void {
    this.dialogRefs.export = this.dialog.open(
      ExportComponent,
      exportSaveDialogOptions
    );
    this.dialogRefs.export.disableClose = true;
    this.dialogRefs.export.afterClosed().subscribe(
      (reponseOrError: string | Error) => this.closeExportDialog(reponseOrError));
  }

  private closeExportDialog(reponseOrError: string | Error): void {
    if (reponseOrError instanceof Error) {
      this.snackBar.open(reponseOrError.message, 'Ok', {
        duration: CONSTANTS.FAILURE_DURATION,
      });
    } else {
      this.snackBar.open(reponseOrError, 'Ok', {
        duration: CONSTANTS.SUCCES_DURATION,
      });
    }
  }

  openSaveDialog(): void {
    this.dialogRefs.save = this.dialog.open(SaveComponent, exportSaveDialogOptions);
    this.dialogRefs.save.disableClose = true;
    this.dialogRefs.save.afterClosed().subscribe((error?: string) => {
      this.closeSaveDialog(error);
    });
  }

  private closeSaveDialog(error?: string): void {
    this.snackBar.open(error || 'Succès', 'Ok', {
      duration: error ? CONSTANTS.FAILURE_DURATION : CONSTANTS.SUCCES_DURATION,
    });
  }

  private closeDocumentationDialog(fromHome: boolean): void {
    if (fromHome) {
      this.openHomeDialog();
    }
  }

  openGalleryDialog(fromHome: boolean): void {
    const dialogOptions: MatDialogConfig = {
      width: '115vw',
      height: '100vh',
      panelClass: 'gallery',
      data: { drawInProgress: this.svgService.drawInProgress },
    };
    this.dialogRefs.gallery = this.dialog.open(
      GalleryComponent,
      dialogOptions,
    );
    this.dialogRefs.gallery.disableClose = false;
    this.dialogRefs.gallery.afterClosed().subscribe((option) => {
      this.closeGalleryDialog(fromHome, option);
    });
  }

  private closeGalleryDialog(
      fromHome: boolean,
      option?: GalleryDraw): void {
    if (!!option) {
      this.loadDraw(option);
    } else if (fromHome) {
      this.openHomeDialog();
    }
  }

  private createNewDraw(shape: SvgShape): void {
    this.svgService.shape = shape;
    this.autoSave.saveShape(shape);
    this.svgService.header = {
      name: '',
      tags: [],
      id: 0
    };
    const rgb = this.colorService.hexToRgb(shape.color);
    this.colorService.selectBackgroundColor(
      `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`
    );
    this.svgService.clearDom();
    this.gridService.handleGrid();
    this.toolSelectorService.set(Tool.Pencil);
    // Deuxième fois juste pour fermer le panneau latéral
    this.toolSelectorService.set(Tool.Pencil);
  }

  private loadDraw(draw: GalleryDraw): void {
    this.colorService.recentColors = draw.colors;
    this.svgService.clearDom();
    this.svgService.shape = draw.shape;
    Array.from(draw.svg.children).forEach((element: SVGGElement) => {
      this.svgService.structure.drawZone.appendChild(element);
    });
    this.svgService.header = draw.header;
    this.undoRedo.setStartingCommand();
    this.toolSelectorService.set(Tool.Pencil);
    this.toolSelectorService.set(Tool.Pencil);
    this.snackBar.open('Dessin chargé avec succès', 'Ok', {
      duration: CONSTANTS.LOAD_DURATION
    });
  }

  private getCommonDialogOptions(): MatDialogConfig {
    return {
      width: '650px',
      height: '90%',
      data: { drawInProgress: this.svgService.drawInProgress || this.autoSave.verifyAvailability()}
    };
  }
}
