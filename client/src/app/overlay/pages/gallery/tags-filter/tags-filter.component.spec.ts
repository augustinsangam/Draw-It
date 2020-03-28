import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatOption
} from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { TagsFilterComponent } from './tags-filter.component';

// tslint:disable: no-string-literal

describe('TagsFilterComponent', () => {
  let component: TagsFilterComponent;
  let fixture: ComponentFixture<TagsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TagsFilterComponent,
      ],
      imports: [
        MaterialModule,
        ReactiveFormsModule,
      ],
      providers: [
        FormBuilder,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsFilterComponent);
    component = fixture.componentInstance;
    component.tags = new Observable<string[]>();
    component.selectedTag = new Observable<string>();
    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should set allTags to allTags when the value of allTags changes', () => {
    const testAllTags = new Subject<string[]>();
    component.tags = testAllTags.asObservable();

    component.ngOnInit();
    testAllTags.next(['test1', 'test2']);

    expect(component['allTags']).toEqual(['test1', 'test2']);
  });

  it('#ngOnInit should call addTag with "test1" when the value of selectedTag changes', () => {
    // tslint:disable-next-line: no-any
    const spy = spyOn<any>(component, 'addTag');

    const testSelectedTag = new Subject<string>();
    component.selectedTag = testSelectedTag.asObservable();

    component.ngOnInit();
    testSelectedTag.next('test1');

    expect(spy).toHaveBeenCalledWith('test1');
  });

  it('#add should add the event\'s value to addedTags if it exists', () => {
    const input = fixture.nativeElement.querySelector('input');
    const event: MatChipInputEvent = {
      input: (input as HTMLInputElement),
      value: 'test',
    };
    component['add'](event);
    expect(component['addedTags']).toEqual(['test']);
  });

  it('#add should add nothing to addedTags if the event\'s value is empty', () => {
    const event: MatChipInputEvent = {
      input: null as unknown as HTMLInputElement,
      value: '',
    };
    component['add'](event);
    expect(component['addedTags']).toEqual([]);
  });

  it('#remove should remove "tag" from addedTags if it contains it', () => {
    component['addedTags'] = ['test1', 'test2'];

    component['remove']('test1');

    expect(component['addedTags']).toEqual(['test2']);
  });

  it('#remove should not remove "tag" from addedTags if it does not contain it', () => {
    component['addedTags'] = ['test1', 'test2'];

    component['remove']('test3');

    expect(component['addedTags']).toEqual(['test1', 'test2']);
  });

  it('#selected should add event.option.viewValue to addedTags', () => {
    const event: MatAutocompleteSelectedEvent = {
      source: component['matAutocomplete'],
      option: {
        viewValue: 'test1'
      } as MatOption,
    };
    component['selected'](event);
    expect(component['addedTags']).toContain('test1');
  });

  it('#_filter should return the tags in allTags that contains "value" and are not in addedTags', () => {
    component['allTags'] = ['test1', 'test2', 'test3'];
    component['addedTags'] = ['test1'];

    const returnedTags = component['_filter']('te');

    expect(returnedTags).toEqual(['test2', 'test3']);
  });

  it('#_filter2 should return the tags in allTags that are not in addedTags', () => {
    component['tagCtrl'].setValue('t');
    component['allTags'] = ['test1', 'test2', 'test3'];
    component['addedTags'] = ['test1'];

    const returnedTags = component['_filter2']();

    expect(returnedTags).toEqual(['test2', 'test3']);
  });

  it('#filteredTagsChangeHandler should call filteredTagsChange.next() with addedTags and searchToggleRef\'s status', () => {
    const spy = spyOn(component.filteredTagsChange, 'next');

    component['tagCtrl'].setValue('t');
    component['addedTags'] = ['test1', 'test2'];
    component['searchToggleRef'].toggle();

    component['filteredTagsChangeHandler']();

    expect(spy).toHaveBeenCalledWith([['test1', 'test2'], true]);
  });

  it('#addTag should add "tag" to addedTags when it does not contain it', () => {
    component['addedTags'] = ['test1', 'test2'];

    component['addTag']('test3');

    expect(component['addedTags']).toEqual(['test1', 'test2', 'test3']);
  });

  it('#addTag should not add "tag" to addedTags when it does contain it', () => {
    component['addedTags'] = ['test1', 'test2', 'test3'];

    component['addTag']('test3');

    expect(component['addedTags']).toEqual(['test1', 'test2', 'test3']);
  });
});
