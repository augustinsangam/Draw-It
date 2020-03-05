import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatChipInputEvent /*, MatAutocompleteSelectedEvent, MatOption, MatOptionParentComponent, MatOptgroup*/ } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { TagsFilterComponent } from './tags-filter.component';
// import { ElementRef, ChangeDetectorRef } from '@angular/core';

// tslint:disable: no-string-literal

fdescribe('TagsFilterComponent', () => {
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
    component.allTags = new Observable<string[]>();
    component.selectedTag = new Observable<string>();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should set tags.allTags to allTags when the value of allTags changes', () => {
    const testAllTags = new Subject<string[]>();
    component.allTags = testAllTags.asObservable();

    component.ngOnInit();
    testAllTags.next(['test1', 'test2']);

    expect(component.tags.allTags).toEqual(['test1', 'test2']);
  });

  it('#ngOnInit should call addTag with "test1" when the value of selectedTag changes', () => {
    const spy = spyOn(component, 'addTag');

    const testSelectedTag = new Subject<string>();
    component.selectedTag = testSelectedTag.asObservable();

    component.ngOnInit();
    testSelectedTag.next('test1');

    expect(spy).toHaveBeenCalledWith('test1');
  });

  it('#add should add the event\'s value to tags.addedTags if it exists', () => {
    const input = fixture.nativeElement.querySelector('input');
    const event: MatChipInputEvent = {
      input: (input as HTMLInputElement),
      value: 'test',
    };
    component.add(event);
    expect(component.tags.addedTags).toEqual(['test']);
  });

  it('#add should add nothing to tags.addedTags if the event\'s value is empty', () => {
    // const input = fixture.nativeElement.querySelector('');
    const event: MatChipInputEvent = {
      input: null as unknown as HTMLInputElement,
      value: '',
    };
    component.add(event);
    expect(component.tags.addedTags).toEqual([]);
  });

  it('#remove should remove "tag" from tags.addedTags if it contains it', () => {
    component.tags.addedTags = ['test1', 'test2'];

    component.remove('test1');

    expect(component.tags.addedTags).toEqual(['test2']);
  });

  it('#remove should not remove "tag" from tags.addedTags if it does not contain it', () => {
    component.tags.addedTags = ['test1', 'test2'];

    component.remove('test3');

    expect(component.tags.addedTags).toEqual(['test1', 'test2']);
  });

  // it('#selected should add event.option.viewValue to tags.addedTags', () => {
  //   const event: MatAutocompleteSelectedEvent = {
  //     source: component['matAutocomplete'], // null as unknown as MatAutocomplete,
  //     option: new MatOption(
  //       null as unknown as ElementRef<HTMLElement>,
  //       null as unknown as ChangeDetectorRef,
  //       null as unknown as MatOptionParentComponent,
  //       null as unknown as MatOptgroup,
  //     ),
  //   };
  //   event.option.value = 'test1';

  //   component.selected(event);

  //   expect(component.tags.addedTags).toContain('test1');
  // });

  it('#_filter should return the tags in tags.allTags that contains "value" and are not in tags.addedTags', () => {
    component.tags.allTags = ['test1', 'test2', 'test3'];
    component.tags.addedTags = ['test1'];

    const returnedTags = component['_filter']('te');

    expect(returnedTags).toEqual(['test2', 'test3']);
  });

  it('#_filter2 should return the tags in tags.allTags that are not in tags.addedTags', () => {
    component.tags.tagCtrl.setValue('t');
    component.tags.allTags = ['test1', 'test2', 'test3'];
    component.tags.addedTags = ['test1'];

    const returnedTags = component['_filter2']();

    expect(returnedTags).toEqual(['test2', 'test3']);
  });

  it('#filteredTagsChangeHandler should call filteredTagsChange.next() with tags.addedTags and searchToggleRef\'s status', () => {
    const spy = spyOn(component.filteredTagsChange, 'next');

    component.tags.tagCtrl.setValue('t');
    component.tags.addedTags = ['test1', 'test2'];
    component['searchToggleRef'].toggle();

    component['filteredTagsChangeHandler']();

    expect(spy).toHaveBeenCalledWith([['test1', 'test2'], true]);
  });

  it('#addTag should add "tag" to tags.addedTags when it does not contain it', () => {
    component.tags.addedTags = ['test1', 'test2'];

    component.addTag('test3');

    expect(component.tags.addedTags).toEqual(['test1', 'test2', 'test3']);
  });

  it('#addTag should not add "tag" to tags.addedTags when it does contain it', () => {
    component.tags.addedTags = ['test1', 'test2', 'test3'];

    component.addTag('test3');

    expect(component.tags.addedTags).toEqual(['test1', 'test2', 'test3']);
  });
});
