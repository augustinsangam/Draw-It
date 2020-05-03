import { Injectable } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MatSnackBar } from '@angular/material';
import { LocalStorageHandlerService } from '../auto-save/local-storage-handler.service';
import { ImageFile } from '../image-file';
import { SelectionService } from '../selection/selection.service';
import { SvgShape } from '../svg/svg-shape';
import { SvgService } from '../svg/svg.service';
import { ColorService } from '../tool/color/color.service';
import { GridService } from '../tool/grid/grid.service';
import { ToolSelectorService } from '../tool/tool-selector/tool-selector.service';
import { Tool } from '../tool/tool.enum';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { OverlayManager } from './overlay-manager';
import { OverlayPages } from './overlay-pages';
import { DocEnum } from './pages/documentation/doc-enum';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { ExportComponent } from './pages/export/export.component';
import { HomeComponent } from './pages/home/home.component';
import { LoadProjectComponent } from './pages/load-project/load-project.component';
import { NewDrawComponent } from './pages/new-draw/new-draw.component';
import { SaveComponent } from './pages/save/save.component';

interface DialogRefs {
  home: MatDialogRef<HomeComponent>;
  newDraw: MatDialogRef<NewDrawComponent>;
  documentation: MatDialogRef<DocumentationComponent>;
  export: MatDialogRef<ExportComponent>;
  save: MatDialogRef<SaveComponent>;
  project: MatDialogRef<LoadProjectComponent>;
}

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  private static readonly SUCCES_DURATION: number = 2000;
  private static readonly FAILURE_DURATION: number = 2020;
  private static readonly LOAD_DURATION: number = 500;
  private static readonly EXPORT_SAVE_DIALOG_OPTIONS: MatDialogConfig = {
    width: '1000px',
    height: '850',
  };

  private dialog: OverlayManager;
  private dialogRefs: DialogRefs;
  private svgService: SvgService;

  constructor(private colorService: ColorService,
              private toolSelectorService: ToolSelectorService,
              private readonly snackBar: MatSnackBar,
              private undoRedo: UndoRedoService,
              private gridService: GridService,
              private autoSave: LocalStorageHandlerService,
              private selectionService: SelectionService
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
      save: (undefined as unknown) as MatDialogRef<SaveComponent>,
      project: (undefined as unknown) as MatDialogRef<LoadProjectComponent>
    };
    this.svgService = svgService;
    this.toolSelectorService.set(Tool.PENCIL);
    this.toolSelectorService.set(Tool.PENCIL);
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
    this.dialogRefs.home.afterClosed().subscribe(
      (result: string) => this.openSelectedDialog(result));
  }

  private openSelectedDialog(dialog: string): void {
    switch (dialog) {
      case OverlayPages.NEW:
        return this.openNewDrawDialog();
      case OverlayPages.DOCUMENTATION:
        return this.openDocumentationDialog(true);
      case OverlayPages.OPEN:
        return this.openLoadProjectDialog(true);
      case OverlayPages.ABOUT:
        return this.openDocumentationDialog(true, DocEnum.ABOUTUS);
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
    if (option === OverlayPages.HOME) {
      this.openHomeDialog();
    } else if (option !== null) {
      this.createNewDraw(option as SvgShape);
    }
  }

  openDocumentationDialog(fromHome: boolean, initSection: DocEnum = DocEnum.WELCOME): void {
    const dialogOptions: MatDialogConfig = {
      width: '98%',
      height: '95vh',
      panelClass: 'documentation'
    };
    this.dialogRefs.documentation = this.dialog.open(
      DocumentationComponent,
      dialogOptions
    );
    this.dialogRefs.documentation.componentInstance.goToSection(initSection);
    this.dialogRefs.documentation.disableClose = false;
    this.dialogRefs.documentation.afterClosed().subscribe(
      () => this.closeDocumentationDialog(fromHome));
  }

  openLoadProjectDialog(fromHome: boolean): void {
    const dialogOptions: MatDialogConfig = {
      width: '650px',
      height: '220px',
      data: { drawInProgress: this.svgService.drawInProgress || (this.autoSave.getDrawing() !== null) }
    };
    this.dialogRefs.project = this.dialog.open(
      LoadProjectComponent,
      dialogOptions
    );
    this.dialogRefs.project.disableClose = false;
    this.dialogRefs.project.afterClosed().subscribe(
      (imageFile?: ImageFile) => this.closeLoadProjectDialog(fromHome, imageFile));
  }

  openExportDialog(): void {
    this.dialogRefs.export = this.dialog.open(
      ExportComponent,
      OverlayService.EXPORT_SAVE_DIALOG_OPTIONS
    );
    this.dialogRefs.export.disableClose = true;
  }

  openSaveDialog(): void {
    this.dialogRefs.save = this.dialog.open(SaveComponent, OverlayService.EXPORT_SAVE_DIALOG_OPTIONS);
    this.dialogRefs.save.disableClose = true;
    this.dialogRefs.save.afterClosed().subscribe(
      (error?: string) => this.closeSaveDialog(error));
  }

  private closeSaveDialog(error?: string): void {
    this.snackBar.open(error || 'Succès', 'Ok', {
      duration: error ? OverlayService.FAILURE_DURATION : OverlayService.SUCCES_DURATION,
    });
  }

  private closeDocumentationDialog(fromHome: boolean): void {
    if (fromHome) {
      this.openHomeDialog();
    }
  }

  private closeLoadProjectDialog(fromHome: boolean, imageFile?: ImageFile): void {
    if (!!imageFile) {
      this.loadDraw(imageFile);
    } else if (fromHome) {
      this.openHomeDialog();
    }
  }

  private createNewDraw(shape: SvgShape): void {
    this.svgService.shape = shape;
    this.autoSave.saveShape(shape);
    this.autoSave.clearDrawings();
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
    this.selectionService.reset();
    this.undoRedo.setStartingCommand();
    this.toolSelectorService.set(Tool.PENCIL);
    this.toolSelectorService.set(Tool.PENCIL);
  }

  private loadDraw(imageFile: ImageFile): void {
    this.svgService.clearDom();
    this.svgService.shape = imageFile.shape;
    const drawingDocument = new DOMParser().parseFromString(
      imageFile.draws,
      'image/svg+xml'
    );
    const draws = drawingDocument.firstElementChild as SVGGElement;
    Array.from(draws.children).forEach((element: SVGGElement) => {
      this.svgService.structure.drawZone.appendChild(element);
    });
    this.svgService.header = imageFile.header;
    this.undoRedo.setStartingCommand();
    this.toolSelectorService.set(Tool.PENCIL);
    this.toolSelectorService.set(Tool.PENCIL);
    this.snackBar.open('Dessin chargé avec succès', 'Ok', {
      duration: OverlayService.LOAD_DURATION
    });
  }

  private getCommonDialogOptions(): MatDialogConfig {
    return {
      width: '650px',
      height: '90%',
      data: { drawInProgress: this.svgService.drawInProgress || (this.autoSave.getDrawing() !== null) }
    };
  }
}
