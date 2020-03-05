import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { TagsFilterComponent } from './tags-filter.component';

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

  it('#add should add the value of the event if it exists', () => {
    const event: MatChipInputEvent = {
      input: new HTMLInputElement(),
      value: 'test',
    };

    component.add(event);

    // expect(component.tags.addedTags).toEqual(['test']);
  });
});
