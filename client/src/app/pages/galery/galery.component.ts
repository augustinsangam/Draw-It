import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import {MatAutocomplete,
   MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
    CommunicationService
  } from 'src/app/communication/communication.service';
import { Draws as DrawsT } from 'src/app/communication/data_generated';
import { DialogData } from '../home/home.component';
import {
  ConfirmationDialogComponent
} from '../new-draw/confirmation-dialog.component';
import {
  DeleteConfirmationDialogComponent
} from './deleteconfirmation-dialog.component';

/**
 * @title Chips Autocomplete
 */

export interface DialogRefs {
  delete: MatDialogRef<DeleteConfirmationDialogComponent>,
  load: MatDialogRef<ConfirmationDialogComponent>,
}

export interface GaleryDraw {
  name: string | null | undefined;
  id: number | null | undefined;
  tags: string[] | null | undefined;
  // TODO: trouver un type different au possible.
  image: string;
}

@Component({
  selector: 'app-galery',
  templateUrl: './galery.component.html',
  styleUrls: ['./galery.component.scss']
})
export class GaleryComponent {
  // visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = ['Lemon'];
  allTags: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  galeryDrawTable: GaleryDraw[];
  filteredGaleryDrawTable: GaleryDraw[];
  private dialogRefs: DialogRefs;
  // private drawInProgress = true;

  @ViewChild('tagInput', {
    static: true,
    read: ElementRef
  })
  tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {
    static: true,
    read: MatAutocomplete
  })
  matAutocomplete: MatAutocomplete;

  constructor(
    private communicationService: CommunicationService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.galeryDrawTable = new Array<GaleryDraw>();
    this.filteredGaleryDrawTable = new Array<GaleryDraw>();
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
        startWith(null),
        map(tag => tag ? this._filter(tag) : this._filter2()));

    this.communicationService.getAll().then(fbbb => {
      const draws = DrawsT.getRoot(fbbb);
      const drawsLenght = draws.drawsLength();
      for (let i = 0; i < drawsLenght; i++) {
        // const name = draws.draws(i).name;
        if (!!draws.draws(i)) {
          let drawsTagsLenght: number;
          const drawTagsTable: string[] = [];

          // FIXME: Faire fonctionner avec la regle lint.
          // tslint:disable: no-non-null-assertion
          if (!!draws.draws(i)!.tagsLength()) {
            drawsTagsLenght = draws.draws(i)!.tagsLength();

            for (let j = 0; j < drawsTagsLenght; j++) {
              let tag: string;

              if (!!draws.draws(i)!.tags(j)) {
                tag = draws.draws(i)!.tags(j);

                drawTagsTable.push(tag);

                if (this.allTags.indexOf(tag) === -1) {
                  this.allTags.push(tag);
                }
              }
            }
          }

          if (!!draws.draws(i)!.name() &&
              !!draws.draws(i)!.id()) {
            const newName = draws.draws(i)!.name();
            const newId = draws.draws(i)!.id();

            // const newImage = require(
            //   '../../../assets/galerytemps' + newId + '.png')

            let newImage: any;
            fetch(encodeURI(
              '../../../assets/galerytemps/' + newId + '.txt'))
            .then(res => res.text())
            .then(text => newImage = text);

            const newGaleryDraw: GaleryDraw = {
              name: newName,
              id: newId,
              tags: drawTagsTable,
              image: newImage
            };

            this.galeryDrawTable.push(newGaleryDraw);
          }
        }
      }
    });
    let newTempsImage: any;
    fetch(encodeURI(
      '../../assets/galerytemps/0.txt'))
    .then(res => res.text())
    .then(text => {
      newTempsImage = text
      const newTempDraw1: GaleryDraw = {
        name: 'test 1',
        id: 0,
        tags: ['Lemon', 'Apple'],
        image: newTempsImage,
      }
      this.galeryDrawTable.push(newTempDraw1);
      const newTempDraw2: GaleryDraw = {
        name: 'test 2',
        id: 1,
        tags: ['Lemon', 'Lime'],
        image: newTempsImage,
      }
      this.galeryDrawTable.push(newTempDraw2);
      const newTempDraw3: GaleryDraw = {
        name: 'test 3',
        id: 2,
        tags: ['Orange', 'Strawberry'],
        image: newTempsImage,
      }
      this.galeryDrawTable.push(newTempDraw3);
      this.filteredGaleryDrawTable = this.galeryDrawTable;
      this.dialogRefs = {
        delete: (
          undefined as unknown
          ) as MatDialogRef<DeleteConfirmationDialogComponent>,
        load: (undefined as unknown) as MatDialogRef<
          ConfirmationDialogComponent
        >
      };
  });
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
    this.filterGaleryTable();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }

    this.filterGaleryTable();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
    this.filterGaleryTable();
  }

  private filterGaleryTable() {
    this.filteredGaleryDrawTable = new Array<GaleryDraw>();

    for (const elem of this.galeryDrawTable) {
      let keep = true;
      for (const tag of this.tags) {
        if (!!elem.tags && elem.tags.indexOf(tag) === -1) {
          keep = false;
        }
      }
      if (keep) {
        this.filteredGaleryDrawTable.push(elem);
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
    return this.allTags.filter(tag => this.tags.indexOf(tag) === -1);
  }

  protected deleteDraw(id: number) {
    this.dialogRefs.delete = this.dialog.open(
      DeleteConfirmationDialogComponent);
    this.dialogRefs.delete.disableClose = true;
    this.dialogRefs.delete.afterClosed().subscribe(this.deleteCloseHandler);
  }

  private deleteCloseHandler = (result: boolean) => {
    if (result) {
      // TODO call delete on the elem
      console.log('delete')
    } else {
      this.dialogRefs.delete.close();
    }
  }

  protected loadDraw(id: number) {
    if (this.data.drawInProgress) {
      this.dialogRefs.load = this.dialog.open(ConfirmationDialogComponent);
      this.dialogRefs.load.disableClose = true;
      this.dialogRefs.load.afterClosed().subscribe(this.loadDrawHandler);
    } else {
      this.loadDrawHandler(true);
    }
  }

  private loadDrawHandler = (result: boolean) => {
    if (result) {
      // TODO creer le dessin a partir du svg du dessin avec l'id
      console.log('creer dessin')
    } else {
      this.dialogRefs.load.close();
    }
  }
}
