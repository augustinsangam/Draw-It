import { CdkObserveContent } from '@angular/cdk/observers';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatCard, MatCardContent,
  MatCardTitle, MatDialogRef, MatFormField, MatInput, MatSlider
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerContentComponent } from 'src/app/tool/color/color-panel/color-picker-content/color-picker-content.component';
import { ColorPickerItemComponent } from 'src/app/tool/color/color-panel/color-picker-item/color-picker-item.component';
import { PaletteDialogComponent } from './palette-dialog.component';

describe('ColorPanelComponent', () => {
  let component: PaletteDialogComponent;
  let fixture: ComponentFixture<PaletteDialogComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PaletteDialogComponent,
        ColorPickerContentComponent,
        ColorPickerItemComponent,
        MatSlider,
        MatCard,
        MatCardContent,
        MatCardTitle,
        MatInput,
        MatFormField,
        CdkObserveContent,

      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        MAT_DIALOG_SCROLL_STRATEGY_PROVIDER,
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaletteDialogComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onPickColor shuld close the dialog', () => {
    component.onPickColor('#FFFFFF');
    expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
  });

  // On en a besoin car les attributs sont privés
  // tslint:disable: no-string-literal
  it('#onKeydownHandler should be call after pressing enter key', () => {
    component['palette'] = { onConfirm: () => { } } as unknown as ColorPickerContentComponent;
    const spy = spyOn(component['palette'], 'onConfirm');
    document.dispatchEvent(new KeyboardEvent('keydown', {
      code: 'Enter',
      key: 'Enter',
    }));
    expect(spy).toHaveBeenCalled();
  });

});
