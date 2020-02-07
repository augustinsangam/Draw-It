import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewDrawComponent } from './new-draw.component';

import { CdkObserveContent } from '@angular/cdk/observers';
import { Overlay } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialog, MatDialogRef,
   MatFormField, MatHint, MatInput, MatLabel } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerItemComponent } from 'src/app/tool/color/color-panel/color-picker-item/color-picker-item.component';
import { ScreenService } from './sreen-service/screen.service';

describe('NewDrawComponent', () => {
  let component: NewDrawComponent;
  let fixture: ComponentFixture<NewDrawComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        NewDrawComponent,
        ColorPickerItemComponent,
        MatLabel,
        MatHint,
        MatFormField,
        CdkObserveContent,
        MatInput,

      ],
      providers: [
        ScreenService,
        FormBuilder,
        MatDialog,
        Overlay,
        MAT_DIALOG_SCROLL_STRATEGY_PROVIDER,
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
