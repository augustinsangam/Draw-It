import {
  EventEmitter
} from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import {
  FormsModule, ReactiveFormsModule
} from '@angular/forms';
import {
  MaterialModule
} from 'src/app/material.module';
import {
  ColorOption,
  ColorPanelComponent
} from './color-panel.component';
import {
  ColorPickerContentComponent
} from './color-picker-content/color-picker-content.component';
import {
  MockColorPickerContentComponent
} from './color-picker-content/mock-color-picker-content.component';
import {
  ColorPickerItemComponent
} from './color-picker-item/color-picker-item.component';

// tslint:disable: no-string-literal no-any no-magic-numbers
describe('ColorPanelComponent', () => {
  let component: ColorPanelComponent;
  let fixture: ComponentFixture<ColorPanelComponent>;
  let paletteColorChange: EventEmitter<string>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ColorPanelComponent,
        ColorPickerContentComponent,
        ColorPickerItemComponent,
      ],
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
      ],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ColorPanelComponent);
    component = fixture.componentInstance;
    spyOn(component.svgService, 'changeBackgroundColor');
    paletteColorChange = new EventEmitter();
    paletteColorChange.subscribe(($color: string) => {
      component['onColorPicked']($color);
    });
    fixture.detectChanges();
  }));

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#Button Palette should call swapColors() method', fakeAsync(() => {
    const spy = spyOn<any>(component, 'swapColors');
    const swapButton = fixture.debugElement.nativeElement.querySelector(
      '#swapButton'
    );
    swapButton.click();
    fixture.whenStable().then(() => {
      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
      }, 500);
      tick(500);
    });
  }));

  it('#onShowPalette() should change showPalette attribute', () => {
    const oldShowPalette = component['showPalette'];
    component['onShowPalette']();
    expect(!oldShowPalette).toEqual(component['showPalette']);
  });

  it('#swapColor() swap colors and update the preview', () => {
    const spy = spyOn<any>(component, 'updatePreviewColors');
    component['swapColors']();
    expect(spy).toHaveBeenCalled();
  });

  it('#onColorPicked() can change Primary color', () => {
    const spyUpdateColor = spyOn(
      component['colorPreviewPrimary'],
      'updateColor'
    );
    const spySelectPrimaryColor = spyOn(
      component.colorService,
      'selectPrimaryColor'
    );
    component['colorOption'] = ColorOption.PRIMARY;
    component['onColorPicked']('rgba(255, 255, 255, 1)');
    expect(spyUpdateColor).toHaveBeenCalled();
    expect(spySelectPrimaryColor).toHaveBeenCalled();
  });

  it('#onColorPicked() can change Secondary color', () => {
    const spyUpdateColor = spyOn(
      component['colorPreviewSecondary'],
      'updateColor'
    );
    const spySelectSecondaryColor = spyOn(
      component.colorService,
      'selectSecondaryColor'
    );
    component['colorOption'] = ColorOption.SECONDARY;
    component['onColorPicked']('rgba(255, 255, 255, 1)');
    expect(spyUpdateColor).toHaveBeenCalled();
    expect(spySelectSecondaryColor).toHaveBeenCalled();
  });

  it('#onColorPicked() can change Background color', () => {
    const spyUpdateColor = spyOn(
      component['colorPreviewBackground'],
      'updateColor'
    );
    const spySelectBackgroundColor = spyOn(
      component.colorService,
      'selectBackgroundColor'
    );
    component['colorOption'] = ColorOption.BACKGROUND;
    component['onColorPicked']('rgba(255, 255, 255, 1)');
    expect(spyUpdateColor).toHaveBeenCalled();
    expect(spySelectBackgroundColor).toHaveBeenCalled();
  });

  it('#addEvents() should updateRecentColors+'
    + 'when Palette not defined', fakeAsync(() => {
      const spyUpdateRecentColors = spyOn<any>(component, 'updateRecentColors');
      component['colorPalette'] =
        (new MockColorPickerContentComponent() as unknown) as
          ColorPickerContentComponent;
      component['addEvents']();
      component['colorsItemsArray'][2].button.nativeElement.click();
      fixture.whenStable().then(() => {
        setTimeout(() => {
          expect(spyUpdateRecentColors).toHaveBeenCalled();
        }, 500);
        tick(500);
      });

      const rightClickEvent = document.createEvent('HTMLEvents');
      rightClickEvent.initEvent('contextmenu', true, false);
      component['colorsItemsArray'][2].button.nativeElement.dispatchEvent(
        rightClickEvent
      );
      fixture.whenStable().then(() => {
        setTimeout(() => {
          expect(spyUpdateRecentColors).toHaveBeenCalled();
        }, 500);
        tick(500);
      });
    }));

  it('#addEvents() should updateRecentColors', fakeAsync(() => {
    const spyUpdateRecentColors = spyOn<any>(component, 'updateRecentColors');
    component['addEvents']();
    component['colorsItemsArray'][2].button.nativeElement.click();

    setTimeout(() => {
      expect(spyUpdateRecentColors).toHaveBeenCalled();
    }, 500);
    tick(500);

    const rightClickEvent = document.createEvent('HTMLEvents');
    rightClickEvent.initEvent('contextmenu', true, false);
    component['colorsItemsArray'][2].button.nativeElement.dispatchEvent(
      rightClickEvent
    );

    setTimeout(() => {
      expect(spyUpdateRecentColors).toHaveBeenCalled();
    }, 500);
    tick(500);

  }));

  it('#addEvents() should updateRecentColors', fakeAsync(() => {
    const spyUpdateRecentColors = spyOn<any>(component, 'updateRecentColors');
    component['addEvents']();
    component['colorsItemsArray'][2].button.nativeElement.click();

    setTimeout(() => {
      expect(spyUpdateRecentColors).toHaveBeenCalled();
    }, 500);
    tick(500);

    const event = new MouseEvent('mousedown', {button: 1});
    component['colorsItemsArray'][2].button.nativeElement.dispatchEvent(
      event
    );

    setTimeout(() => {
      expect(spyUpdateRecentColors).toHaveBeenCalled();
    }, 500);
    tick(500);

  }));

  it('#addEvents() should updateRecentColors', fakeAsync(() => {
    const spyUpdateRecentColors = spyOn<any>(component, 'updateRecentColors');
    component['addEvents']();
    component['colorsItemsArray'][2].button.nativeElement.click();

    setTimeout(() => {
      expect(spyUpdateRecentColors).toHaveBeenCalled();
    }, 500);
    tick(500);

    const event = new MouseEvent('mousedown', {button: 3});
    component['colorsItemsArray'][2].button.nativeElement.dispatchEvent(
      event
    );

    setTimeout(() => {
      expect(spyUpdateRecentColors).toHaveBeenCalled();
    }, 500);
    tick(500);

  }));

  it('#getStartColor() works !', () => {
    component['colorOption'] = ColorOption.PRIMARY;
    component.colorService.primaryColor = 'rgba(255, 255, 255, 1)';
    expect(component['getStartColor']()).toEqual('#FFFFFF');

    component['colorOption'] = ColorOption.SECONDARY;
    component.colorService.secondaryColor = 'rgba(255, 255, 255, 1)';
    expect(component['getStartColor']()).toEqual('#FFFFFF');

    component['colorOption'] = ColorOption.BACKGROUND;
    component.colorService.backgroundColor = 'rgba(255, 255, 255, 1)';
    expect(component['getStartColor']()).toEqual('#FFFFFF');
  });

  it('#The pannel should update when primary or secondary color change', () => {
    const spyOnInit = spyOn(component, 'ngOnInit');
    const spyAfterViewInit = spyOn(component, 'ngAfterViewInit');
    component.colorService.change.next();
    expect(spyOnInit).toHaveBeenCalled();
    expect(spyAfterViewInit).toHaveBeenCalled();
  });

  it('#promoteColor update recent colors only when colorPalette'
  + 'is initalized', () => {
    component['colorPalette'] = undefined as
      unknown as ColorPickerContentComponent;
    const spy = spyOn<any>(component, 'updateRecentColors');
    component['promoteColor'](3);
    expect(spy).not.toHaveBeenCalled();
  });

});
