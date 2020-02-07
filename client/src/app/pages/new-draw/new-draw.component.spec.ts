import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewDrawComponent } from './new-draw.component';

import { CdkObserveContent } from '@angular/cdk/observers';
import { Overlay } from '@angular/cdk/overlay';
import { ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatCard, MatCardContent,
   MatCardTitle, MatDialog, MatDialogActions, MatDialogClose, MatDialogContainer, MatDialogContent, MatDialogRef, MatFormField, MatHint, MatInput, MatLabel, MatSlider } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPicklerContentComponent } from 'src/app/tool/color/color-panel/color-pickler-content/color-pickler-content.component';
import { ColorPicklerItemComponent } from 'src/app/tool/color/color-panel/color-pickler-item/color-pickler-item.component';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { PaletteDialogComponent } from './palette-dialog.component';
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
        BrowserAnimationsModule,
      ],
      declarations: [
        NewDrawComponent,
        ColorPicklerItemComponent,
        MatLabel,
        MatHint,
        MatFormField,
        CdkObserveContent,
        MatInput,
        PaletteDialogComponent,
        ConfirmationDialogComponent,
        MatDialogContainer,
        ColorPicklerContentComponent,
        MatDialogActions,
        MatDialogContent,
        MatDialogClose,
        MatSlider,
        MatCard,
        MatCardContent,
        MatCardTitle,

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
      schemas: []
    })
    .overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          PaletteDialogComponent,
          ConfirmationDialogComponent,
          NewDrawComponent,
          MatDialogContainer,
        ]
      }
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should call updateFormSize.', () => {
    const spy = spyOn(component, 'updateFormSize');

    component.ngOnInit();

    component['screenService'].size.next({height: 100, width: 100});

    expect(spy).toHaveBeenCalled();
  });

  it('#ngOnDestroy should call unsubscribe.', () => {
    const spy = spyOn(component['screenSize'], 'unsubscribe');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });

  it('#ngAfterViewInit should do smth when click', (done: DoneFn) => {
    // const spy = spyOn(component['dialog'], 'open').and.callThrough();

    component['palette'] = {
      button: new ElementRef(document.createElement('button')),
    } as ColorPicklerItemComponent;

    // component['palette'].button.nativeElement = document.createElement('div');

    component.ngAfterViewInit();

    console.log(component['palette'].button);

    component['palette'].button.nativeElement.click();

    // setTimeout(() => {
    //   // expect(spy).toHaveBeenCalled();
    //   done();
    // }, 500);
  });

  it('#closePaletteDialog should call palette.updateColor with colorPicked if it is not undefine', () => {
    const spy = spyOn(component.palette, 'updateColor');

    component['closePaletteDialog']('#FFFFFF');

    expect(spy).toHaveBeenCalledWith('#FFFFFF');
  });


  it('#closePaletteDialog should not call palette.updateColor if colorPiked is undefine', () => {
    const spy = spyOn(component.palette, 'updateColor');

    component['closePaletteDialog'](undefined);

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('#updateFormSize should not call form.patchVale() if userChangeSizeMannually is true', () => {
    const spy = spyOn(component['form'], 'patchValue');

    component['userChangeSizeMannually'] = true;

    component.updateFormSize({width: 100, height: 100});

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('#updateFormSize should call form.patchVale() if userChangeSizeMannually is false', () => {
    const spy = spyOn(component['form'], 'patchValue');

    component['userChangeSizeMannually'] = false;

    component.updateFormSize({width: 100, height: 100});

    expect(spy).toHaveBeenCalled();
  });

  it('#onDimensionsChangedByUser should set userChangeSizeMannually to true', () => {
    component['userChangeSizeMannually'] = false;

    component.onDimensionsChangedByUser();

    expect(component['userChangeSizeMannually']).toBe(true);
  });

  it('#onSubmit should call dialogRef.close if data.drawInProgress is false', () => {
    component.data.drawInProgress = false;

    component.onSubmit();

    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('#onSubmit should call dialogRef.close if data.drawInProgress is false', () => {
    component.data.drawInProgress = true;
    component['dialogRefs'].confirm = component['dialog'].open(ConfirmationDialogComponent);
    component['dialogRefs'].confirm.disableClose = false;

    component.onSubmit();

    component['dialogRefs'].confirm.close();

    expect(component['dialogRefs'].confirm.disableClose).toBe(true);
  });
///////////// plus de onSubmit

  it('#closeDialog should call dialogRef.close with this.form.value if result is true', () => {
    component['closeDialog'](true);

    expect(mockDialogRef.close).toHaveBeenCalledWith(component['form'].value);
  });

  it('#closeDialog should call dialogRef.close with "home" if result is false', () => {
    component['closeDialog'](false);

    expect(mockDialogRef.close).toHaveBeenCalledWith('home');
  });

  it('#onReturn should call dialogRef.close with "home"', () => {
    component.onReturn();

    expect(mockDialogRef.close).toHaveBeenCalledWith('home');
  });
});
