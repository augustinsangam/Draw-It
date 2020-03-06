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
import { SvgHeader, SvgShape } from 'src/app/svg/svg.service';
import { ScreenService } from '../new-draw/sreen-service/screen.service';

const CARD_WIDTH = 342;
const SNACKBAR_DURATION = 5000;
const NOT_FOUND = -1;

export interface DialogRefs {
  delete: MatDialogRef<DeleteConfirmationDialogComponent>;
  load: MatDialogRef<ConfirmationDialogComponent>;
}

export interface GalleryDraw {
  svg: SVGGElement;
  header: SvgHeader;
  shape: SvgShape;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements AfterViewInit {

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

    this.communicationService.get().then((fbbb) => {
      this.createGalleryDrawsTable(fbbb);
    }).catch((err: string) => {
      this.loading = false;
      this.snackBar.open(err, 'Ok', {
        duration: SNACKBAR_DURATION
      });
    });
  }
  // TODO: Splitter
  private createGalleryDrawsTable(fbbb: flatbuffers.ByteBuffer): void {
    this.loading = false;
    const draws = Draws.getRoot(fbbb);
    const drawsLenght = draws.drawBuffersLength();
    const tempsAllTags = new Set<string>();

    for (let i = drawsLenght - 1; i !== 0; i--) {

      const drawBuffer = draws.drawBuffers(i);
      if (drawBuffer == null) {
        continue;
      }
      const id = drawBuffer.id();
      const serializedDraw = drawBuffer.bufArray();

      if (serializedDraw == null) {
        continue;
      }
      const drawFbbb = new flatbuffers.ByteBuffer(serializedDraw);
      const draw = Draw.getRoot(drawFbbb);
      const newName = draw.name();
      const tagArrayLenght = draw.tagsLength();
      const newTagArray = new Array<string>();

      for (let j = 0; j < tagArrayLenght; j++) {
        const tag = draw.tags(j);
        newTagArray.push(tag);
        tempsAllTags.add(tag);
      }

      const svgElement = draw.svg();

      if (!!svgElement) {
        const newSvg = this.communicationService.decodeElementRecursively(
          svgElement, this.renderer) as SVGGElement;

        const newGalleryDraw: GalleryDraw = {
          header: {
            id,
            name: newName as string,
            tags: newTagArray,
          },
          shape: {
            height: draw.height(),
            width: draw.width(),
            color: draw.color() as string
          },
          svg: newSvg,
        };

        this.galleryDrawTable.push(newGalleryDraw);
      }
    }
    this.allTags.next(Array.from(tempsAllTags));
    this.filteredGalleryDrawTable = this.galleryDrawTable;
    this.ajustImagesWidth();
  }

  ngAfterViewInit(): void {
    this.screenService.size.subscribe(() => this.ajustImagesWidth());
  }

  protected ajustImagesWidth(): void {
    const contentWidth = this.cardContent.nativeElement.clientWidth;
    if (this.filteredGalleryDrawTable.length === 0) {
      this.renderer.setStyle(this.cardContent.nativeElement, 'padding-left', '0px');
      return ;
    }
    if (this.filteredGalleryDrawTable.length * CARD_WIDTH < contentWidth) {
      this.renderer.setStyle(this.cardContent.nativeElement, 'padding-left',
        `${(contentWidth - (this.filteredGalleryDrawTable.length * CARD_WIDTH)) / 2}px`);
    } else {
      this.renderer.setStyle(this.cardContent.nativeElement, 'padding-left',
        `${(contentWidth % CARD_WIDTH) / 2}px`);
    }
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
        keep = (elem.header.tags.indexOf(tag) !== NOT_FOUND);
        if (!searchToggle && keep) {
          break;
        }
      }
      if (keep) {
        this.filteredGalleryDrawTable.push(elem);
      }
    }
    this.ajustImagesWidth();
  }

  protected deleteDraw(id: number): void {
    this.dialogRefs.delete = this.dialog.open(
      DeleteConfirmationDialogComponent);
    this.dialogRefs.delete.disableClose = true;
    this.dialogRefs.delete.afterClosed().subscribe(
      (result) => this.deleteCloseHandler(result, id));
  }

  private deleteCloseHandler = (result: boolean, id: number) => {
    if (result) {
      this.communicationService.delete(id).then(
        (promise) => this.deletePromiseHandler(promise, id))
        .catch(() => {
          this.snackBar.open('Impossible de supprimer le dessin', 'Ok', {
            duration: SNACKBAR_DURATION
          });
        });
    } else {
      this.dialogRefs.delete.close();
    }
  }
  // TODO: Petite fonction askip pour le draw (DRY)
  private deletePromiseHandler(result: string | null, id: number): void {
    if (result) {
      this.snackBar.open('Impossible de supprimer le dessin', 'Ok', {
        duration: SNACKBAR_DURATION
      });
    } else {
      const draw = this.galleryDrawTable.filter((element) => element.header.id === id);
      this.galleryDrawTable.splice(this.galleryDrawTable.indexOf(draw[0]), 1);
      this.ajustImagesWidth();
    }
  }

  protected loadDraw(id: number): void {
    if (this.data.drawInProgress) {
      this.dialogRefs.load = this.dialog.open(ConfirmationDialogComponent);
      this.dialogRefs.load.disableClose = true;
      this.dialogRefs.load.afterClosed().subscribe(
        (result) => this.loadDrawHandler(result, id));
    } else {
      this.loadDrawHandler(true, id);
    }
  }

  private loadDrawHandler = (result: boolean, id: number) => {
    if (result) {
      const draw = this.galleryDrawTable.filter((element) => element.header.id === id);
      this.dialogRef.close(draw[0]);
    } else {
      this.dialogRefs.load.close();
    }
  }
}
