import {
  AfterViewInit, Component, ElementRef, Inject,
  Optional, Renderer2, ViewChild
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog, MatDialogRef, MatSnackBar,
} from '@angular/material';
import {
  CommunicationService
} from 'src/app/communication/communication.service';
import { Draw, Draws } from '../../../communication/data_generated';
import { DialogData } from '../home/home.component';
import {
  ConfirmationDialogComponent
} from '../new-draw/confirmation-dialog.component';
import {
  DeleteConfirmationDialogComponent
} from './deleteconfirmation-dialog.component';

import { flatbuffers } from 'flatbuffers';
import { Subject } from 'rxjs';
import { SvgHeader } from 'src/app/svg/svg-header';
import { SvgShape } from 'src/app/svg/svg-shape';
import { NOT_FOUND } from '../../../not-found';
import { ScreenService } from '../new-draw/sreen-service/screen.service';

export interface DialogRefs {
  delete: MatDialogRef<DeleteConfirmationDialogComponent>;
  load: MatDialogRef<ConfirmationDialogComponent>;
}

export interface GalleryDraw {
  svg: SVGGElement;
  header: SvgHeader;
  shape: SvgShape;
  colors: string[];
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements AfterViewInit {

  private static readonly CARD_WIDTH: number = 342;
  private static readonly SNACKBAR_DURATION: number = 5000;

  protected loading: boolean;
  protected selectedTag: Subject<string>;
  protected allTags: Subject<string[]>;
  protected galleryDrawTable: GalleryDraw[];
  protected filteredGalleryDrawTable: GalleryDraw[];
  private dialogRefs: DialogRefs;

  @ViewChild('cardContent', {
    static: false
  }) private cardContent: ElementRef<HTMLElement>;

  constructor(
    private communicationService: CommunicationService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    @Optional() public dialogRef: MatDialogRef<GalleryComponent>,
    private renderer: Renderer2,
    private screenService: ScreenService,
    private snackBar: MatSnackBar
  ) {
    this.loading = true;
    this.galleryDrawTable = new Array<GalleryDraw>();
    this.filteredGalleryDrawTable = new Array<GalleryDraw>();
    this.allTags = new Subject<string[]>();
    this.selectedTag = new Subject<string>();
    this.dialogRefs = {
      delete:
        (undefined as unknown) as MatDialogRef<DeleteConfirmationDialogComponent>,
      load: (undefined as unknown) as MatDialogRef<ConfirmationDialogComponent>,
    };
  }

  ngAfterViewInit(): void {
    this.screenService.size.subscribe(() => this.ajustImagesWidth());

    this.getAll().catch((err: string) => {
      this.loading = false;
      this.snackBar.open(err, 'Ok', {
        duration: GalleryComponent.SNACKBAR_DURATION
      });
    });
  }

  async getAll(): Promise<void> {
    return this.communicationService.get().then((fbbb) => {
      this.responsePromiseHandler(fbbb);
    });
  }

  private responsePromiseHandler(fbbb: flatbuffers.ByteBuffer): void {
    this.loading = false;
    const draws = Draws.getRoot(fbbb);
    this.createGalleryDrawsTable(draws);
  }

  private createGalleryDrawsTable(draws: Draws): void {
    const drawsLenght = draws.drawBuffersLength();
    let tempsAllTags = new Set<string>();

    for (let i = drawsLenght - 1; i >= 0; --i) {
      const drawBuffer = draws.drawBuffers(i);
      if (drawBuffer == null) {
        continue;
      }

      const serializedDraw = drawBuffer.bufArray();
      if (serializedDraw == null) {
        continue;
      }

      const drawFbbb = new flatbuffers.ByteBuffer(serializedDraw);
      const draw = Draw.getRoot(drawFbbb);
      const id = drawBuffer.id();
      tempsAllTags = this.newDraw(draw, id, tempsAllTags);
    }
    this.allTags.next(Array.from(tempsAllTags));
    this.filteredGalleryDrawTable = this.galleryDrawTable;
    this.ajustImagesWidth();
  }

  private newDraw(draw: Draw, id: number, tempsAllTags: Set<string>): Set<string> {
    const tagsLength = draw.tagsLength();
    const newTagArray = new Array<string>(tagsLength);
    for (let i = 0; i < tagsLength; ++i) {
      const tag = draw.tags(i);
      newTagArray[i] = tag;
      tempsAllTags.add(tag);
    }

    const colorsLength = draw.colorsLength();
    const colors = new Array<string>(colorsLength);
    for (let i = 0; i < colorsLength; ++i) {
      colors[i] = draw.colors(i);
    }

    const svgElement = draw.svg();
    if (svgElement === null) {
      return tempsAllTags;
    }

    const svg = this.communicationService.decodeElementRecursively(
      svgElement, this.renderer) as SVGGElement;

    const newGalleryDraw: GalleryDraw = {
      header: {
        id,
        name: draw.name() as string,
        tags: newTagArray,
      },
      shape: {
        height: draw.height(),
        width: draw.width(),
        color: draw.color() as string
      },
      svg,
      colors,
    };
    this.galleryDrawTable.push(newGalleryDraw);

    return tempsAllTags;
  }

  protected ajustImagesWidth(): void {
    const contentWidth = this.cardContent.nativeElement.clientWidth;
    if (this.filteredGalleryDrawTable.length === 0) {
      this.renderer.setStyle(this.cardContent.nativeElement, 'padding-left', '0px');
      return;
    }

    if (this.filteredGalleryDrawTable.length * GalleryComponent.CARD_WIDTH < contentWidth) {
      this.renderer.setStyle(this.cardContent.nativeElement, 'padding-left',
        `${(contentWidth - (this.filteredGalleryDrawTable.length * GalleryComponent.CARD_WIDTH)) / 2}px`);
      return;
    }

    this.renderer.setStyle(this.cardContent.nativeElement, 'padding-left',
      `${(contentWidth % GalleryComponent.CARD_WIDTH) / 2}px`);

  }

  protected addTag(tag: string): void {
    this.selectedTag.next(tag);
    this.ajustImagesWidth();
  }

  protected filterGalleryTable([tags, searchToggle]: [string[], boolean]): void {
    this.filteredGalleryDrawTable = new Array<GalleryDraw>();

    for (const elem of this.galleryDrawTable) {
      let keep = true;
      for (const tag of tags) {
        if (searchToggle) {
          keep = (elem.header.tags.indexOf(tag) !== NOT_FOUND) && keep;
          continue;
        }
        keep = (elem.header.tags.indexOf(tag) !== NOT_FOUND);
        if (keep) {
          break;
        }
      }
      if (keep) {
        this.filteredGalleryDrawTable.push(elem);
      }
    }
    this.ajustImagesWidth();
  }

  private findDraw(id: number): GalleryDraw {
    const draw = this.galleryDrawTable.filter((element) => element.header.id === id);
    return draw[0];
  }

  protected deleteDraw(id: number): void {
    this.dialogRefs.delete = this.dialog.open(
      DeleteConfirmationDialogComponent);
    this.dialogRefs.delete.disableClose = true;
    this.dialogRefs.delete.afterClosed().subscribe(
      (result) => this.deleteCloseHandler(result, id));
  }

  private deleteCloseHandler(result: boolean, id: number): void {
    if (!result) {
      this.dialogRefs.delete.close();
      return;
    }

    this.communicationService.delete(id).then(
      (promise) => this.deletePromiseHandler(promise, id))
      .catch(() => {
        this.snackBar.open('Impossible de supprimer le dessin', 'Ok', {
          duration: GalleryComponent.SNACKBAR_DURATION
        });
      });
  }

  private deletePromiseHandler(result: string | null, id: number): void {
    if (result) {
      this.snackBar.open('Impossible de supprimer le dessin', 'Ok', {
        duration: GalleryComponent.SNACKBAR_DURATION
      });
      return;
    }

    this.galleryDrawTable.splice(this.galleryDrawTable.indexOf(this.findDraw(id)), 1);
    this.ajustImagesWidth();
  }

  protected loadDraw(id: number): void {
    if (!this.data.drawInProgress) {
      this.loadDrawHandler(true, id);
      return;
    }

    this.dialogRefs.load = this.dialog.open(ConfirmationDialogComponent);
    this.dialogRefs.load.disableClose = true;
    this.dialogRefs.load.afterClosed().subscribe(
      (result) => this.loadDrawHandler(result, id));
  }

  private loadDrawHandler(result: boolean, id: number): void {
    if (result) {
      this.dialogRef.close(this.findDraw(id));
      return;
    }

    this.dialogRefs.load.close();
  }
}
