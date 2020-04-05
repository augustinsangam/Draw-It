import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {CdkObserveContent} from '@angular/cdk/observers';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatRipple} from '@angular/material/core';
import {MatFormField} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatSlider} from '@angular/material/slider';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PanelComponent} from '../../../../panel/panel.component';
import {ColorPanelComponent} from '../../../color/color-panel/color-panel.component';
import {ColorPickerContentComponent} from '../../../color/color-panel/color-picker-content/color-picker-content.component';
import {ColorPickerItemComponent} from '../../../color/color-panel/color-picker-item/color-picker-item.component';
import { FeatherpenPanelComponent } from './featherpen-panel.component';

// tslint:disable:no-magic-numbers no-string-literal no-any
describe('FeatherpenPanelComponent', () => {
  let component: FeatherpenPanelComponent;
  let fixture: ComponentFixture<FeatherpenPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FeatherpenPanelComponent,
        PanelComponent,
        ColorPanelComponent,
        ColorPickerItemComponent,
        ColorPickerContentComponent,
        MatInput,
        MatSlider,
        MatRadioButton,
        MatIcon,
        MatRadioGroup,
        MatCardTitle,
        MatCardContent,
        MatCard,
        MatRipple,
        MatFormField,
        CdkObserveContent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatherpenPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onLengthChange should change the value in the service', () => {
    component['lengthSlider'].value = 42;
    component['onLengthChange']();
    expect(component['service'].length).toEqual(42);
  });

  it('#onAngleChange should change the value in the service', () => {
    component['angleSlider'].value = 69;
    component['onAngleChange']();
    expect(component['service'].angle).toEqual(69);
  });

  it('#updatePreview should call setAttribute of renderer', () => {
    const spy = spyOn(component['renderer'], 'setAttribute');
    component['updatePreview']();
    expect(spy).toHaveBeenCalled();
  });

  it('#the update preview method should be called when the service observable emits', () => {
    const spy = spyOn<any>(component, 'updatePreview');
    component['service'].emitter.next();
    expect(spy).toHaveBeenCalled();
  });

});
