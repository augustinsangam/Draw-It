import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Overlay } from '@angular/cdk/overlay';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { MaterialModule } from 'src/app/material.module';
import { DeleteConfirmationDialogComponent } from './deleteconfirmation-dialog.component';
import { GalleryCardComponent } from './gallery-card/gallery-card.component';
import { GalleryComponent } from './gallery.component';
import { TagsFilterComponent } from './tags-filter/tags-filter.component';

// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
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

  it('#ajustImageWidth should set the padding of cardContent to 29 when width of saved draws is less than the width', () => {
    component['renderer'].setStyle(component['cardContent'].nativeElement, 'width', '400px');
    component.galleryDrawTable.length = 1;

    component['ajustImagesWidth']();

    expect(component['cardContent'].nativeElement.style.paddingLeft).toEqual('29px');
  });

  it('#ajustImageWidth should set the padding of cardContent to 29 when width of saved draws is more than the width', () => {
    component['renderer'].setStyle(component['cardContent'].nativeElement, 'width', '800px');
    component.galleryDrawTable.length = 4;

    component['ajustImagesWidth']();

    expect(component['cardContent'].nativeElement.style.paddingLeft).toEqual('58px');
  });
});
