import { CdkObserveContent } from '@angular/cdk/observers';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatCard, MatCardContent, MatCardTitle, MatFormField,
  MatInput, MatRipple, MatSlider, MatSliderChange } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerItemComponent } from '../color-picker-item/color-picker-item.component';
import { ColorPickerContentComponent } from './color-picker-content.component';

/* tslint:disable:no-string-literal */
describe('ColorPickerContentComponent', () => {
  let component: ColorPickerContentComponent;
  let fixture: ComponentFixture<ColorPickerContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ColorPickerContentComponent,
        ColorPickerItemComponent,
        MatInput,
        MatFormField,
        MatSlider,
        MatButton,
        MatCard,
        MatCardTitle,
        MatCardContent,
        CdkObserveContent,
        MatRipple,
      ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerContentComponent);
    component = fixture.componentInstance;
    component.startColor = '#FFFFFF';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onSlide should change only r value', () => {

    component['ngAfterViewInit']();

    const oldG = component['colorForm'].controls.g.value;
    const oldB = component['colorForm'].controls.b.value;

    const slideEvent = new MatSliderChange();
    slideEvent.value = 200;
    component['onSlide'](slideEvent);

    expect(oldG).toBe(component['colorForm'].controls.g.value);
    expect(oldB).toBe(component['colorForm'].controls.b.value);
    expect(component['colorForm'].controls.r.value).toEqual(200);

  });

  it('#Red field should not accept bad value', () => {
    component['colorForm'].patchValue({ r: -100 });
    component['onChangeR']();
    expect(component['colorForm'].controls.r.value).toEqual(0);

    component['colorForm'].patchValue({ r: 256 });
    component['onChangeR']();
    expect(component['colorForm'].controls.r.value).toEqual(255);
  });

  it('#Green field should not accept bad value', () => {
    component['colorForm'].patchValue({ g: -100 });
    component['onChangeG']();
    expect(component['colorForm'].controls.g.value).toEqual(0);

    component['colorForm'].patchValue({ g: 256 });
    component['onChangeG']();
    expect(component['colorForm'].controls.g.value).toEqual(255);
  });

  it('#Blue field should not accept bad value', () => {
    component['colorForm'].patchValue({ b: -100 });
    component['onChangeB']();
    expect(component['colorForm'].controls.b.value).toEqual(0);

    component['colorForm'].patchValue({ b: 256 });
    component['onChangeB']();
    expect(component['colorForm'].controls.b.value).toEqual(255);
  });

  it('#Alpha field should not accept bad value', () => {
    component['colorForm'].patchValue({ a: -100 });
    component['onChangeA']();
    expect(component['colorForm'].controls.a.value).toEqual(0);

    component['colorForm'].patchValue({ a: 101 });
    component['onChangeA']();
    expect(component['colorForm'].controls.a.value).toEqual(100);
  });

  it('#onChangeR methods should replace the slider and update hex value', () => {
    // any est demandé parceque c'est une méthode privée
    const spyPlaceSlider = spyOn<any>(component, 'placeSlider');
    const spyUpdateHex = spyOn<any>(component, 'updateHex');
    component['colorForm'].patchValue({ r: 100 });
    component['onChangeR']();
    expect(spyPlaceSlider).toHaveBeenCalled();
    expect(spyUpdateHex).toHaveBeenCalled();
  });

  it('#onChangeG methods should update the hex value', () => {
    const spyUpdateHex = spyOn<any>(component, 'updateHex');
    component['colorForm'].patchValue({ g: 100 });
    component['onChangeG']();
    expect(spyUpdateHex).toHaveBeenCalled();
  });

  it('#onChangeB methods should update the hex value', () => {
    const spyUpdateHex = spyOn<any>(component, 'updateHex');
    component['colorForm'].patchValue({ b: 100 });
    component['onChangeB']();
    expect(spyUpdateHex).toHaveBeenCalled();
  });

  it('#onChangeA methods should not change other inputs', () => {
    const oldR = component['colorForm'].controls.r.value;
    const oldG = component['colorForm'].controls.g.value;
    const oldB = component['colorForm'].controls.b.value;

    component['colorForm'].patchValue({ a: 80 });
    component['onChangeA']();

    expect(oldR).toBe(component['colorForm'].controls.r.value);
    expect(oldG).toBe(component['colorForm'].controls.g.value);
    expect(oldB).toBe(component['colorForm'].controls.b.value);
  });

  it('#onConfirm methods should emit the the actual RGBA', fakeAsync(() => {
    setTimeout(() => {
      component['colorChange'].subscribe(() => {
        // Si on arrive ici cela veut dire qu'une couleur a bien été émise
        expect(true).toBe(true);
      });
      component.onConfirm();
    }, 500);
    tick(600);
  }))

  it('#hex field should accept only hexadecimal color value', () => {

    component['colorForm'].patchValue({ r: '20' });
    component['colorForm'].patchValue({ g: '20' });
    component['colorForm'].patchValue({ b: '20' });

    component['colorForm'].patchValue({ hex: 'ZZZZZZ' });

    component['updateHex']();

    expect(component['colorForm'].controls.r.value).toBe('20');
    expect(component['colorForm'].controls.g.value).toBe('20');
    expect(component['colorForm'].controls.b.value).toBe('20');

  });

  it('#onChangeHex should change other form fields', () => {
    component['colorForm'].patchValue({ r: 250 });
    component['colorForm'].patchValue({ g: 250 });
    component['colorForm'].patchValue({ b: 250 });

    component['colorForm'].patchValue({ hex: 'FFFFFF' });
    component['onChangeHex']();

    expect(component['colorForm'].controls.r.value).toEqual(255);
    expect(component['colorForm'].controls.g.value).toEqual(255);
    expect(component['colorForm'].controls.b.value).toEqual(255);

  });

  it('#onChangeHex should not change other form fields when hex value is invalid', () => {
    component['colorForm'].patchValue({ r: 255 });
    component['colorForm'].patchValue({ g: 255 });
    component['colorForm'].patchValue({ b: 255 });

    component['colorForm'].patchValue({ hex: 'ZZFFFFFF' });
    component['onChangeHex']();

    expect(component['colorForm'].controls.r.value).toEqual(255);
    expect(component['colorForm'].controls.g.value).toEqual(255);
    expect(component['colorForm'].controls.b.value).toEqual(255);

  });

  it('#traker should be redraw after a click on the canvas', () => {
    const spy = spyOn<any>(component, 'drawTracker');
    component['canvas'].nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });

  it('#palette should be reinitialised after a click on a recent color', () => {
    const spy = spyOn<any>(component, 'initialiseStartingColor');
    component['baseColorsCircles'].toArray()[3].button.nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });

  it('focusing in handler works', () => {
    const spy = spyOn(component['shortcutHandler'], 'desactivateAll');
    component['focusHandlers'].in();
    expect(spy).toHaveBeenCalled();
  });

  it('focusing out handler works', () => {
    const spy = spyOn(component['shortcutHandler'], 'activateAll');
    component['focusHandlers'].out();
    expect(spy).toHaveBeenCalled();
  });

  it('#In Focusing and Out Focus disable when blockAllShortcus is true', () => {
    const spy = spyOn(component['eventManager'], 'addEventListener');
    component['blockAllShortcus'] = true;
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalledTimes(11); // 10 fois pour chaque couleur et 1 fois pour le canvas
  });

});
