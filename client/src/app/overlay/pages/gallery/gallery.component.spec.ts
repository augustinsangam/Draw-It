import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryComponent } from './gallery.component';
import { MaterialModule } from 'src/app/material.module';
import { TagsFilterComponent } from './tags-filter/tags-filter.component';
import { GalleryCardComponent } from './gallery-card/gallery-card.component';
import { DeleteConfirmationDialogComponent } from './deleteconfirmation-dialog.component';
import { Overlay } from '@angular/cdk/overlay';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

fdescribe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DeleteConfirmationDialogComponent,
        GalleryCardComponent,
        GalleryComponent,
        TagsFilterComponent,
      ],
      imports: [
        MaterialModule,
        ReactiveFormsModule,
      ],
      providers: [
        FormBuilder,
        MatDialog,
        Overlay,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
