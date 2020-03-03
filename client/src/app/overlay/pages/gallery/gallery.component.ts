import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  AfterViewInit, Component, ElementRef, Inject,
  Optional, Renderer2, ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog, MatDialogRef,
  MatSlideToggle,
  MatSlideToggleChange
} from '@angular/material';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements AfterViewInit {
  // Determine si la recherche se fait avec OU ou ET
  searchStatementToggle = false;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[];
  allTags: string[];
  galleryDrawTable: GalleryDraw[];
  filteredGalleryDrawTable: GalleryDraw[];
  private dialogRefs: DialogRefs;
  svg: SVGSVGElement;

  @ViewChild('searchToggleRef', {
    static: false,
    read: MatSlideToggle
  }) protected searchToggleRef: MatSlideToggle;

  @ViewChild('tagInput', {
    static: false,
    read: ElementRef
  }) protected tagInput: ElementRef<HTMLInputElement>;

  @ViewChild('auto', {
    static: false,
    read: MatAutocomplete
  }) protected matAutocomplete: MatAutocomplete;

  @ViewChild('cardContent', {
    static: false
  }) private cardContent: ElementRef<HTMLElement>;

  constructor(
    private communicationService: CommunicationService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    @Optional() public dialogRef: MatDialogRef<GalleryComponent>,
    private renderer: Renderer2,
    private screenService: ScreenService
  ) {

    this.galleryDrawTable = new Array<GalleryDraw>();
    this.filteredGalleryDrawTable = new Array<GalleryDraw>();
    this.allTags = new Array<string>();
    this.tags = new Array<string>();
    this.dialogRefs = {
      delete:
        (undefined as unknown) as MatDialogRef<DeleteConfirmationDialogComponent>,
      load: (undefined as unknown) as MatDialogRef<ConfirmationDialogComponent>,
    };
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map(tag => tag ? this._filter(tag) : this._filter2()));

    this.communicationService.getAll().then(fbbb => {
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
        const newId = drawBuffer.id();
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
              id: newId,
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
    this.allTags = Array.from(tempsAllTags);
    this.filteredGalleryDrawTable = this.galleryDrawTable;
    this.tagCtrl.setValue(null);
    this.tagInput.nativeElement.blur();
    this.ajustImagesWidth();
  }

  ngAfterViewInit(): void {
    this.searchToggleRef.change.subscribe(($event: MatSlideToggleChange) => {
      this.searchStatementToggle = $event.checked;
      this.filterGalleryTable();
    });
    this.screenService.size.subscribe(() => this.ajustImagesWidth());
  }

  protected ajustImagesWidth(): void {
    const contentWidth = this.cardContent.nativeElement.clientWidth - 20;
    this.renderer.setStyle(this.cardContent.nativeElement, 'padding-left',
      `${(contentWidth % 340) / 2}px`);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our tag
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.filterGalleryTable();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }

    this.tagCtrl.setValue(null);
    this.filterGalleryTable();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
    this.filterGalleryTable();
  }

  private filterGalleryTable() {
    this.filteredGalleryDrawTable = new Array<GalleryDraw>();

    for (const elem of this.galleryDrawTable) {
      let keep = true;
      for (const tag of this.tags) {
        if (this.searchStatementToggle) {
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

  private _filter(value: string): string[] {
    return this.allTags.filter(
      tag => tag.toLowerCase().indexOf(value.toLowerCase()) === 0 &&
        this.tags.indexOf(tag) === -1
    );
  }

  private _filter2() {
    return this.allTags.filter((tag) => this.tags.indexOf(tag) === -1);
  }

  addTag(tag: string): void {
    if (this.tags.indexOf(tag) === -1) {
      this.tags.push(tag);
    }
    this.tagCtrl.setValue(null);
    this.filterGalleryTable();
  }

  protected deleteDraw(id: number) {
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

  private deletePromiseHandler(result: any, id: number): void {
    if (result) {
      console.log('ERREUR');
    } else {
      const draw = this.galleryDrawTable.filter((element) => element.id === id);
      this.galleryDrawTable.splice(this.galleryDrawTable.indexOf(draw[0]), 1);
      this.filterGalleryTable();
    }
  }

  protected loadDraw(id: number) {
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
