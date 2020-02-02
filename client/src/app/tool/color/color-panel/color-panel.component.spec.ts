import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CdkObserveContent } from '@angular/cdk/observers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardContent, MatCardTitle, MatFormField, MatIcon,
  MatRadioButton, MatRadioGroup, MatRipple, MatSlider } from '@angular/material';
import { MockComponent } from 'ng-mocks';
import { ColorPanelComponent } from './color-panel.component';
import { ColorPicklerContentComponent } from './color-pickler-content/color-pickler-content.component';
import { ColorPicklerItemComponent } from './color-pickler-item/color-pickler-item.component';

fdescribe('ColorPanelComponent', () => {
  let component: ColorPanelComponent;
  let fixture: ComponentFixture<ColorPanelComponent>;
  // let colorService: ColorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CdkObserveContent,
        ColorPanelComponent,
        ColorPicklerContentComponent,
        ColorPicklerItemComponent,
        MatCard,
        MatCardTitle,
        MatCardContent,
        MatIcon,
        MatFormField,
        MatRadioButton,
        MatRadioGroup,
        MatRipple,
        MatSlider,
        MockComponent(ColorPicklerContentComponent),
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPanelComponent);
    component = fixture.componentInstance;
    // colorService = fixture.componentInstance.colorService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#method swapColors() swaps colors', async(() => {
    const spy = spyOn(component, 'swapColors');
    const swapButton = fixture.debugElement.nativeElement.querySelector('#swapButton');
    swapButton.click();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });

  }));

  it('#Palette can be open and close', async(() => {
    // The palette should be hide at the begenning
    const hideShowButton = fixture.debugElement.nativeElement.querySelector('.palette');
    expect(component.showPalette).toEqual(false);
    hideShowButton.click();
    fixture.whenStable().then(() => {
      expect(component.showPalette).toEqual(true);
      hideShowButton.click();
      fixture.whenStable().then(() => {
        expect(component.showPalette).toEqual(false);
      })
    });
  }));

  it('#method onColorPicked() should be called when a color is choosen in the palette', () => {
      console.log(component.colorPalette);
      component.colorPalette.colorChange.emit('rgba(80, 80, 80, 1)');
      const spy = spyOn(component, 'onColorPicked');
      fixture.whenStable().then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
      });
  });

});
