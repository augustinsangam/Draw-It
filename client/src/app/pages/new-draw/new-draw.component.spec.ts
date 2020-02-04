import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewDrawComponent } from './new-draw.component';

import { CdkObserveContent } from '@angular/cdk/observers';
import { Overlay } from '@angular/cdk/overlay';
import { MAT_DIALOG_DATA, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialog, MatDialogRef,
   MatFormField, MatHint, MatInputModule, MatLabel } from '@angular/material';
import { ColorPicklerItemComponent } from 'src/app/tool/color/color-panel/color-pickler-item/color-pickler-item.component';
import { ScreenService } from './sreen-service/screen.service';

fdescribe('NewDrawComponent', () => {
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
        MatInputModule,
        MatLabel
      ],
      declarations: [
        NewDrawComponent,
        ColorPicklerItemComponent,
        MatLabel,
        MatHint,
        MatFormField,
        CdkObserveContent,
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
      ]
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
