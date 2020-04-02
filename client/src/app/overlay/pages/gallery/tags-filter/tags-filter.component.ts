import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatSlideToggle } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

const MIN_TAG_LENGTH = 3;
const MAX_TAG_LENGTH = 21;
const NOT_FOUND = -1;

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

  protected separatorKeysCodes: number[];
  protected addedTags: string[];
  protected allTags: string[];
  protected filteredTags: Observable<string[]>;
  protected tagCtrl: FormControl;

  constructor() {
    this.separatorKeysCodes = [ENTER, COMMA];
    this.allTags = [];
    this.addedTags = [];
    this.tagCtrl = new FormControl();
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

  protected add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    const toAdd = (value || '').trim();
    if (this.addedTags.indexOf(toAdd) === NOT_FOUND &&
        toAdd.length >= MIN_TAG_LENGTH &&
        toAdd.length <= MAX_TAG_LENGTH) {
      this.addedTags.push(value.trim());
      input.value = '';
    }
    this.filteredTagsChangeHandler();
    this.tagCtrl.setValue(null);
  }

  protected remove(tag: string): void {
    const index = this.addedTags.indexOf(tag);

    if (index >= 0) {
      this.addedTags.splice(index, 1);
    }

    this.tagCtrl.setValue(null);
    this.filteredTagsChangeHandler();
  }

  protected selected(event: MatAutocompleteSelectedEvent): void {
    this.addedTags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
    this.filteredTagsChangeHandler();
  }

  private _filter(value: string): string[] {
    return this.allTags.filter(
      (tag) => tag.toLowerCase().indexOf(value.toLowerCase()) === 0 &&
        this.addedTags.indexOf(tag) === NOT_FOUND
    );
  }

  private _filter2(): string[] {
    return this.allTags.filter((tag) => this.addedTags.indexOf(tag) === NOT_FOUND);
  }

  private filteredTagsChangeHandler(): void {
    this.filteredTagsChange.next([this.addedTags, this.searchToggleRef.checked]);
  }

  private addTag(tag: string): void {
    if (this.addedTags.indexOf(tag) === NOT_FOUND) {
      this.addedTags.push(tag);
    }
    this.tagCtrl.setValue(null);
    this.filteredTagsChangeHandler();
  }
}
