import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {CdkObserveContent} from '@angular/cdk/observers';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatRipple} from '@angular/material/core';
import {MatFormField} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatSlider} from '@angular/material/slider';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ColorPanelComponent} from '../../../color/color-panel/color-panel.component';
import {ColorPickerContentComponent} from '../../../color/color-panel/color-picker-content/color-picker-content.component';
import {ColorPickerItemComponent} from '../../../color/color-panel/color-picker-item/color-picker-item.component';
import { AerosolPanelComponent } from './aerosol-panel.component';

// tslint:disable:no-string-literal no-any disable:no-magic-numbers
describe('AerosolPanelComponent', () => {
  let component: AerosolPanelComponent;
  let fixture: ComponentFixture<AerosolPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [
        AerosolPanelComponent,
        CdkObserveContent,
        ColorPanelComponent,
        MatInput,
        MatFormField,
        MatSlider,
        MatSlideToggle,
        MatRadioButton,
        ColorPickerItemComponent,
        ColorPickerContentComponent,
        MatIcon,
        MatRadioGroup,
        MatRipple,
        MatCard,
        MatCardContent,
        MatCardTitle
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AerosolPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it ('onThicknessChange should change the service value when' +
    'the user changes it from the slider, and update the thumbnail', () => {
    const spy = spyOn<any>(component, 'updateThumbnail');
    const expectedValue = 42;
    component['thicknessSlider'].value = expectedValue;
    component['onThicknessChange']();
    expect(spy).toHaveBeenCalled();
    expect(component['aerosolForm'].controls['thicknessFormField'].value)
      .toEqual(expectedValue);
  });

  it ('onFrequencyChange should change the service value when' +
    'the user changes it from the slider, and update the thumbnail', () => {
    const spy = spyOn<any>(component, 'updateThumbnail');
    const expectedValue = 150;
    component['frequencySlider'].value = expectedValue;
    component['onFrequencyChange']();
    expect(spy).toHaveBeenCalled();
    expect(component['aerosolForm'].controls['frequencyFormField'].value)
      .toEqual(expectedValue);
  });

  it('#ngAfterViewInit should update the thumbnail', () => {
    const spyOnUpdate = spyOn<any>(component, 'updateThumbnail');
    component['ngAfterViewInit']();
    expect(spyOnUpdate).toHaveBeenCalled();
  });

  it ('updateThumbnail should update the prevPath ´d´ attribute ', () => {
    const dummyPath = 'M 190.1649298384418, 139.4657776162013 ' +
      'a 1, 1 0 1, 0 2,0 a 1, 1 0 1, 0 -2,0';
    component['service'].frequency = 1;
    component['prevPathRef'].nativeElement.setAttribute('d', '');
    const spyOnGenerate = spyOn<any>(component['service'], 'generatePoints').
    and.callFake(
      () => dummyPath
    );
    component['updateThumbnail']();
    expect(component['prevPathRef'].nativeElement.getAttribute('d'))
      .toEqual(dummyPath);
    expect(spyOnGenerate).toHaveBeenCalled();
  });
});
