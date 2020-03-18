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
  }

  ngAfterViewInit(): void {
    this.screenService.size.subscribe(() => this.ajustImagesWidth());

    this.getAll().catch((err: string) => {
      this.loading = false;
      this.snackBar.open(err, 'Ok', {
        duration: SNACKBAR_DURATION
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
    const newTagArray = new Array<string>();

    for (let i = 0; i < draw.tagsLength(); i++) {
      const tag = draw.tags(i);
      newTagArray.push(tag);
      tempsAllTags.add(tag);
    }

    const svgElement = draw.svg();

    let svg: SVGGElement;

    if (!!svgElement) {
      svg = this.communicationService.decodeElementRecursively(
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
      };
      this.galleryDrawTable.push(newGalleryDraw);
    }

    return tempsAllTags;
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
        if (!searchToggle) {
          keep = (elem.header.tags.indexOf(tag) !== NOT_FOUND);
          if (keep) {
            break;
          }
        } else {
          keep = (elem.header.tags.indexOf(tag) !== NOT_FOUND) && keep;
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

  private deletePromiseHandler(result: string | null, id: number): void {
    if (result) {
      this.snackBar.open('Impossible de supprimer le dessin', 'Ok', {
        duration: SNACKBAR_DURATION
      });
    } else {
      this.galleryDrawTable.splice(this.galleryDrawTable.indexOf(this.findDraw(id)), 1);
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
      this.dialogRef.close(this.findDraw(id));
    } else {
      this.dialogRefs.load.close();
    }
  }
}
