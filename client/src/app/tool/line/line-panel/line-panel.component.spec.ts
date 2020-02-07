import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { CdkObserveContent } from '@angular/cdk/observers';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle, MatFormField, MatIcon, MatInput,
   MatRadioButton, MatRadioGroup, MatRipple, MatSlider, MatSlideToggle, MatSlideToggleChange } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPanelComponent } from '../../color/color-panel/color-panel.component';
import { ColorPickerContentComponent } from '../../color/color-panel/color-picker-content/color-picker-content.component';
import { ColorPickerItemComponent } from '../../color/color-panel/color-picker-item/color-picker-item.component';
import {LinePanelComponent} from './line-panel.component';

// tslint:disable: no-string-literal
describe('LinePanelComponent', () => {
  let component: LinePanelComponent;
  let fixture: ComponentFixture<LinePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        LinePanelComponent,
        MatSlider,
        MatSlideToggle,
        MatFormField,
        MatInput,
        ColorPanelComponent,
        MatRipple,
        CdkObserveContent,
        MatRadioButton,
        ColorPickerItemComponent,
        ColorPickerContentComponent,
        MatIcon,
        MatRadioGroup,
        MatCardTitle,
        MatCardContent,
        MatCard,
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait changer l\'attribut withJonction du service à false', () => {
    component['service'].withJonction = true;
    component['onChangeJonctionOption'](new MatSlideToggleChange(component['slideToggle'], false));
    expect(component['service'].withJonction).toBeFalsy();
  });

  it('onThicknessChange devrait appeler la fonction patchValue', () => {
    const spy = spyOn(component['lineForm'], 'patchValue');
    component['onThicknessChange']();
    expect(spy).toHaveBeenCalled();
  });

  it('onRadiusChange devrait appeler la fonction patchValue', () => {
    const spy = spyOn(component['lineForm'], 'patchValue');
    component['onRadiusChange']();
    expect(spy).toHaveBeenCalled();
  });

});
