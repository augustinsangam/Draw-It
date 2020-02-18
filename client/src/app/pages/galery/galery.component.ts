import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocomplete,
   MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
    CommunicationService
  } from 'src/app/communication/communication.service';
import { Draws as DrawsT } from 'src/app/communication/data_generated';

/**
 * @title Chips Autocomplete
 */

export interface GaleryDraw {
  name: string | null | undefined;
  id: number | null | undefined;
  tags: string[] | null | undefined;
}

@Component({
  selector: 'app-galery',
  templateUrl: './galery.component.html',
  styleUrls: ['./galery.component.scss']
})
export class GaleryComponent {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = ['Lemon'];
  allTags: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  galeryDrawTable: GaleryDraw[];

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

  constructor(private communicationService: CommunicationService) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
        startWith(null),
        // filter((tag: string | null) => !!tag && this.tags.indexOf(tag) == 0).
        map(tag => tag ? this._filter(tag) : this._filter2()));

    this.communicationService.getAll().then(fbbb => {
      const draws = DrawsT.getRoot(fbbb);
      const drawsLenght = draws.drawsLength();
      for (let i = 0; i < drawsLenght; i++) {
        // const name = draws.draws(i).name;
        const drawsTagsLenght = draws.draws(i)?.tagsLength();
        const tempTagsTable: string[] = [];
        if (!!drawsTagsLenght) {
          for (let j = 0; j < drawsTagsLenght; j++) {
            const tag = draws.draws(i)?.tags(j);

            if (!!tag) {
              tempTagsTable.push(tag);
              if (this.allTags.indexOf(tag) === -1) {
                this.allTags.push(tag);
              }
            }

          }
        }

        const newGaleryDraw: GaleryDraw = {
          name: draws.draws(i)?.name(),
          id: draws.draws(i)?.id(),
          tags: tempTagsTable,
        };

        this.galeryDrawTable.push(newGaleryDraw);
      }
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

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filter2() {
    const value = this.tags;
    return this.allTags.filter(tag => value.indexOf(tag) !== -1);
  }
}
