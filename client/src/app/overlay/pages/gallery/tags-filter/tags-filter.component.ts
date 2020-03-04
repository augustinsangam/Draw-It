import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatSlideToggle } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
// import { GalleryDraw } from '../gallery.component';s

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
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: Tags;

  @Input() allTags: Observable<string[]>;
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
    this.tags = {
      allTags: new Array<string>(),
      addedTags: new Array<string>(),
      tagCtrl: new FormControl(),
      filteredTags: new Observable<string[]>(),
    };
    this.tags.filteredTags = this.tags.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag) => tag ? this._filter(tag) : this._filter2()));
    this.filteredTagsChange = new Subject<[string[], boolean]>();
  }

  ngOnInit(): void {
    this.allTags.subscribe((allTags) => {
      this.tags.allTags = allTags;
      this.tags.tagCtrl.setValue(null);
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
    if (this.tags.addedTags.indexOf(toAdd) === -1 &&
        toAdd.length >= 3 &&
        toAdd.length <= 21) {
      this.tags.addedTags.push(value.trim());
      input.value = '';
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.filteredTagsChangeHandler();

    this.tags.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.addedTags.indexOf(tag);

    if (index >= 0) {
      this.tags.addedTags.splice(index, 1);
    }

    this.tags.tagCtrl.setValue(null);
    this.filteredTagsChangeHandler();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.addedTags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tags.tagCtrl.setValue(null);
    this.filteredTagsChangeHandler();
  }

  private _filter(value: string): string[] {
    return this.tags.allTags.filter(
      (tag) => tag.toLowerCase().indexOf(value.toLowerCase()) === 0 &&
        this.tags.addedTags.indexOf(tag) === -1
    );
  }

  private _filter2(): string[] {
    return this.tags.allTags.filter((tag) => this.tags.addedTags.indexOf(tag) === -1);
  }

  protected filteredTagsChangeHandler(): void {
    this.filteredTagsChange.next([this.tags.addedTags, this.searchToggleRef.checked]);
  }

  addTag(tag: string): void {
    if (this.tags.addedTags.indexOf(tag) === -1) {
      this.tags.addedTags.push(tag);
    }
    this.tags.tagCtrl.setValue(null);
    this.filteredTagsChangeHandler();
  }
}
