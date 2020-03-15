import { CdkObserveContent } from '@angular/cdk/observers';
import { ComponentType, Overlay } from '@angular/cdk/overlay';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MAT_DIALOG_SCROLL_STRATEGY_PROVIDER,
  MatCard,
  MatCardContent,
  MatCardTitle,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContainer,
  MatDialogContent,
  MatDialogRef,
  MatFormField,
  MatHint,
  MatInput,
  MatLabel,
  MatSlider
} from '@angular/material';
import {
  BrowserDynamicTestingModule
} from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ElementRef } from '@angular/core';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import {
  ColorPickerContentComponent
} from 'src/app/tool/color/color-panel/color-picker-content/color-picker-content.component';
import {
  ColorPickerItemComponent
} from 'src/app/tool/color/color-panel/color-picker-item/color-picker-item.component';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { NewDrawComponent } from './new-draw.component';
import { PaletteDialogComponent } from './palette-dialog.component';
import { ScreenService } from './sreen-service/screen.service';

// TODO : Ask the chargé de lab
// tslint:disable: no-string-literal
describe('NewDrawComponent', () => {
  let component: NewDrawComponent;
  let fixture: ComponentFixture<NewDrawComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, BrowserAnimationsModule],
      declarations: [
        NewDrawComponent,
        ColorPickerItemComponent,
        MatLabel,
        MatHint,
        MatFormField,
        CdkObserveContent,
        MatInput,
        PaletteDialogComponent,
        ConfirmationDialogComponent,
        MatDialogContainer,
        MatDialogActions,
        MatDialogContent,
        MatDialogClose,
        MatSlider,
        MatCard,
        MatCardContent,
        MatCardTitle,
        ColorPickerContentComponent
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
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        {
          provide: HAMMER_LOADER,
          useValue: async () => new Promise(() => {})
        }
      ],
      schemas: []
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          PaletteDialogComponent,
          ConfirmationDialogComponent,
          NewDrawComponent,
          MatDialogContainer
        ]
      }
    });
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
    // On a explicitement besoin du any car c'est une méthode privée
    const spy = spyOn<any>(component, 'updateFormSize');
    component.ngOnInit();
    component['screenService'].size.next({ height: 100, width: 100 });
    expect(spy).toHaveBeenCalled();
  });

  it('#ngOnDestroy should call unsubscribe.', () => {
    const spy = spyOn(component['screenSize'], 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('#ngAfterViewInit should do smth when click', fakeAsync(() => {
    const spyDialogOpen = spyOn(component['dialog'], 'open').and.callFake(
      // On a besoin d'utiliser les funtion à cause du template
      // tslint:disable-next-line: no-shadowed-variable only-arrow-functions
      function <PaletteDialogComponent>():
        MatDialogRef<PaletteDialogComponent> {
        return ({
          afterClosed: () => new Observable<any>()
        } as unknown) as MatDialogRef<PaletteDialogComponent>;
      }
    );

    component['palette'] =
      new ElementRef(component['renderer'].createElement('div'));

    component.ngAfterViewInit();

    const halfSecond = 500;
    tick(halfSecond);
    component['palette'].nativeElement.click();
    setTimeout(() => {
      expect(spyDialogOpen).toHaveBeenCalled();
    }, halfSecond);
    tick(halfSecond);

  }));

  it('#paletteCloseHandler should call closePaletteDialog', () => {
    // La méthode est privée. On n'a pas le choix
    // tslint:disable-next-line: no-any
    const spy = spyOn<any>(component, 'closePaletteDialog').and.callThrough();
    component['paletteCloseHandler']('#FFFFFF');
    expect(spy).toHaveBeenCalled();
  });

  it(
    '#closePaletteDialog should call palette.' +
    'updateColor with colorPicked if it is not undefine',
    () => {
      const spy = spyOn(component['renderer'], 'setStyle');
      component['closePaletteDialog']('#FFFFFF');
      expect(spy).toHaveBeenCalled();
    }
  );

  it(
    '#closePaletteDialog should not call palette.updateColor' +
    'if colorPiked is undefine',
    () => {
      const spy = spyOn(component['form'], 'patchValue');
      component['closePaletteDialog'](undefined);
      expect(spy).not.toHaveBeenCalled();
    }
  );

  it(
    '#updateFormSize should not call form.patchVale()' +
    'if userChangeSizeMannually is true',
    () => {
      const spy = spyOn(component['form'], 'patchValue');
      component['userChangeSizeMannually'] = true;
      component['updateFormSize']({ width: 100, height: 100 });
      expect(spy).toHaveBeenCalledTimes(0);
    }
  );

  it(
    '#updateFormSize should call form.patchVale()' +
    'if userChangeSizeMannually is false',
    () => {
      const spy = spyOn(component['form'], 'patchValue');
      component['userChangeSizeMannually'] = false;
      component['updateFormSize']({ width: 100, height: 100 });
      expect(spy).toHaveBeenCalled();
    }
  );

  it(
    '#onDimensionsChangedByUser should set ' +
    'userChangeSizeMannually to true',
    () => {
      component['userChangeSizeMannually'] = false;
      component['onDimensionsChangedByUser']();
      expect(component['userChangeSizeMannually']).toBe(true);
    }
  );

  it(
    '#onSubmit should call dialogRef.close' + 'if data.drawInProgress is false',
    () => {
      component['data'].drawInProgress = false;
      component['onSubmit']();
      expect(mockDialogRef.close).toHaveBeenCalled();
    }
  );

  it(
    '#onSubmit should call dialogRef.close' + 'if data.drawInProgress is false',
    fakeAsync(() => {
      const spyDialogOpen = spyOn(component['dialog'], 'open').and.callFake(
        // On a besoin d'utiliser les funtion à cause du template
        // tslint:disable-next-line: no-shadowed-variable only-arrow-functions
        function <PaletteDialogComponent>(component:
          ComponentType<PaletteDialogComponent>
        ): MatDialogRef<PaletteDialogComponent> {
          return ({
            afterClosed: () => new Observable<boolean>(),
            close: (result: boolean) => { },
            disableclose: Boolean
          } as unknown) as MatDialogRef<PaletteDialogComponent>;
        }
      );
      component['data'].drawInProgress = true;
      component['onSubmit']();
      component['dialogRefs'].confirm.close(false);
      expect(spyDialogOpen).toBeTruthy();
      expect(component['dialogRefs'].confirm.disableClose).toBe(true);
    })
  );

  it('#onSubmitHandler should call closeDialog', () => {
    // Any uniquement parceque la methode est privee
    const spy = spyOn<any>(component, 'closeDialog').and.callThrough();
    component['onSubmitHandler'](false);
    expect(spy).toHaveBeenCalled();
  });

  it(
    '#closeDialog should call dialogRef.close with' +
    'this.form.value if result is true',
    () => {
      component['closeDialog'](true);
      expect(mockDialogRef.close).toHaveBeenCalledWith(component['form'].value);
    }
  );

  it(
    '#closeDialog should call dialogRef.close' +
    'with "home" if result is false',
    () => {
      component['closeDialog'](false);
      expect(mockDialogRef.close).toHaveBeenCalledWith('home');
    }
  );

  it('#onReturn should call dialogRef.close with "home"', () => {
    component['onReturn']();
    expect(mockDialogRef.close).toHaveBeenCalledWith('home');
  });

  it('#Other', () => {
    const spy = spyOn(component['renderer'], 'listen');
    component['palette'] = undefined as unknown as ElementRef<HTMLElement>;
    component['ngAfterViewInit']();
    expect(spy).toHaveBeenCalledTimes(0);
  });

});
