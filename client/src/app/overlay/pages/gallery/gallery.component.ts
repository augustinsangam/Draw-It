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
import { ScreenService } from '../new-draw/sreen-service/screen.service';
import { Observable, Subject } from 'rxjs';

/**
 * @title Chips Autocomplete
 */

export interface DialogRefs {
  delete: MatDialogRef<DeleteConfirmationDialogComponent>;
  load: MatDialogRef<ConfirmationDialogComponent>;
}

export interface GalleryDraw {
  name: string | null;
  id: number;
  svg: SVGGElement;
  tags: string[];
  height: number;
  width: number;
  backgroundColor: string;
}

export interface DrawsArrays {
  galleryDrawTable: GalleryDraw[];
  filteredGalleryDrawTable: GalleryDraw[];
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements AfterViewInit {
  // Determine si la recherche se fait avec OU ou ET
  selectedTag: Subject<string>;
  allTags: Subject<string[]>;
  galleryDrawTable: GalleryDraw[];
  filteredGalleryDrawTable: GalleryDraw[];
  private dialogRefs: DialogRefs;
  svg: SVGSVGElement;

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
    this.galleryDrawTable = new Array<GalleryDraw>();
    this.filteredGalleryDrawTable = new Array<GalleryDraw>();
    this.allTags = new Subject<string[]>();
    this.selectedTag = new Subject<string>();
    this.dialogRefs = {
      delete:
        (undefined as unknown) as MatDialogRef<DeleteConfirmationDialogComponent>,
      load: (undefined as unknown) as MatDialogRef<ConfirmationDialogComponent>,
    };

    this.communicationService.getAll().then((fbbb) => {
      this.createGalleryDrawsTable(fbbb);
    });
  }

  createGalleryDrawsTable(fbbb: flatbuffers.ByteBuffer): void {
    const draws = Draws.getRoot(fbbb);
    const drawsLenght = draws.drawBuffersLength();
    const tempsAllTags = new Set<string>();

    for (let i = drawsLenght; i--; ) {
      const drawBuffer = draws.drawBuffers(i);

      if (!!drawBuffer) {
        const id = drawBuffer.id();
        const serializedDraw = drawBuffer.bufArray();

        if (!!serializedDraw) {
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
              id,
              name: newName,
              svg: newSvg,
              tags: newTagArray,
              height: draw.height(),
              width: draw.width(),
              backgroundColor: draw.color() as string
            };

            this.galleryDrawTable.push(newGalleryDraw);
          }
        }
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
    const contentWidth = this.cardContent.nativeElement.clientWidth - 20;
    this.renderer.setStyle(this.cardContent.nativeElement, 'padding-left',
      `${(contentWidth % 340) / 2}px`);
  }

  addTag(tag: string): void {
    this.selectedTag.next(tag);
  }

  protected filterGalleryTable([tags, searchToggle]: [string[], boolean]): void {
    this.filteredGalleryDrawTable = new Array<GalleryDraw>();

    for (const elem of this.galleryDrawTable) {
      let keep = true;
      for (const tag of tags) {
        if (searchToggle) {
          if (elem.tags.indexOf(tag) === -1) {   // ET
            keep = false;
          }
        } else {
          if (elem.tags.indexOf(tag) !== -1) {  // OU
            keep = true;
            break;
          } else {
            keep = false;
          }
        }
      }
      if (keep) {
        this.filteredGalleryDrawTable.push(elem);
      }
    }
  }

  protected deleteDraw(id: number): void {
    this.dialogRefs.delete = this.dialog.open(
      DeleteConfirmationDialogComponent);
    this.dialogRefs.delete.disableClose = true;
    this.dialogRefs.delete.afterClosed().subscribe(
      result => this.deleteCloseHandler(result, id));
  }

  private deleteCloseHandler = (result: boolean, id: number) => {
    if (result) {
      this.communicationService.delete(id).then(
        (promise) => this.deletePromiseHandler(promise, id));
    } else {
      this.dialogRefs.delete.close();
    }
  }

  private deletePromiseHandler(result: string | null, id: number): void {
    if (result) {
      this.snackBar.open('Impossible de supprimer le dessin', 'Ok', {
        duration: 5000
      });
    } else {
      const draw = this.galleryDrawTable.filter((element) => element.id === id);
      this.galleryDrawTable.splice(this.galleryDrawTable.indexOf(draw[0]), 1);
      // this.filterGalleryTable();
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
      const draw = this.galleryDrawTable.filter((element) => element.id === id);
      this.dialogRef.close(draw[0]);
    } else {
      this.dialogRefs.load.close();
    }
  }
}
