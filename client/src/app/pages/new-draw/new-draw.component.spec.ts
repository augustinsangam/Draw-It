import { async, ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MccColorPickerModule } from 'material-community-components';
import { MaterialModule } from 'src/app/material.module';
=======

import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
>>>>>>> next
import { NewDrawComponent } from './new-draw.component';

import { CdkObserveContent } from '@angular/cdk/observers';
import { Overlay } from '@angular/cdk/overlay';
import { MatDialog, MatFormField, MatHint, MatLabel, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialogRef } from '@angular/material';
import { ColorPicklerItemComponent } from 'src/app/tool/color/color-panel/color-pickler-item/color-pickler-item.component';
import { ScreenService } from './sreen-service/screen.service';

fdescribe('NewDrawComponent', () => {
  let component: NewDrawComponent;
  let fixture: ComponentFixture<NewDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
<<<<<<< HEAD
      imports: [ MaterialModule, FormsModule, ReactiveFormsModule, MccColorPickerModule, MatDialogRef, MatDialog ],
      declarations: [ NewDrawComponent ],
=======
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        NewDrawComponent,
        ColorPicklerItemComponent,
        MatLabel,
        MatHint,
        MatFormField,
        CdkObserveContent
      ],
      providers: [
        ScreenService,
        FormBuilder,
        MatDialog,
        Overlay,
        MAT_DIALOG_SCROLL_STRATEGY_PROVIDER,
        MatDialogRef
      ]
>>>>>>> next
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
