import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatSlideToggle } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
// import { GalleryDraw } from '../gallery.component';s

const MINTAGLENGTH = Number('3');
const MAXTAGLENGTH = Number('21');

export interface Tags {
  addedTags: string[];
  allTags: string[];
  filteredTags: Observable<string[]>;
  tagCtrl: FormControl;
}

@Component({
  selector: 'app-tags-filter',
  templateUrl: './tags-filter.component.html',
  styleUrls: ['./tags-filter.component.scss']
})
export class TagsFilterComponent implements OnInit {

  // Determine si la recherche se fait avec OU ou ET
  protected separatorKeysCodes: number[] = [ENTER, COMMA];
  protected addedTags: string[];
  protected allTags: string[];
  protected filteredTags: Observable<string[]>;
  protected tagCtrl: FormControl;

  @Input() tags: Observable<string[]>;
  @Input() selectedTag: Observable<string>;

  @Output() filteredTagsChange: Subject<[string[], boolean]>;

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

  constructor() {
    this.allTags = new Array<string>(),
    this.addedTags = new Array<string>(),
    this.tagCtrl = new FormControl(),
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag) => tag ? this._filter(tag) : this._filter2()));
    this.filteredTagsChange = new Subject<[string[], boolean]>();
  }

  ngOnInit(): void {
    this.tags.subscribe((allTags) => {
      this.allTags = allTags;
      this.tagCtrl.setValue(null);
    });

    this.selectedTag.subscribe((tag) => {
      this.addTag(tag);
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    const toAdd = (value || '').trim();
    if (this.addedTags.indexOf(toAdd) === -1 &&
        toAdd.length >= MINTAGLENGTH &&
        toAdd.length <= MAXTAGLENGTH) {
      this.addedTags.push(value.trim());
      input.value = '';
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.filteredTagsChangeHandler();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.addedTags.indexOf(tag);

    if (index >= 0) {
      this.addedTags.splice(index, 1);
    }

    this.tagCtrl.setValue(null);
    this.filteredTagsChangeHandler();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.addedTags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
    this.filteredTagsChangeHandler();
  }

  private _filter(value: string): string[] {
    return this.allTags.filter(
      (tag) => tag.toLowerCase().indexOf(value.toLowerCase()) === 0 &&
        this.addedTags.indexOf(tag) === -1
    );
  }

  private _filter2(): string[] {
    return this.allTags.filter((tag) => this.addedTags.indexOf(tag) === -1);
  }

  protected filteredTagsChangeHandler(): void {
    this.filteredTagsChange.next([this.addedTags, this.searchToggleRef.checked]);
  }

  addTag(tag: string): void {
    if (this.addedTags.indexOf(tag) === -1) {
      this.addedTags.push(tag);
    }
    this.tagCtrl.setValue(null);
    this.filteredTagsChangeHandler();
  }
}
