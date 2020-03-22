import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EraserPanelComponent } from './eraser-panel.component';

import { CdkObserveContent } from '@angular/cdk/observers';
import {
  MatCard,
  MatCardContent,
  MatCardTitle,
  MatFormField,
  MatIcon,
  MatInput,
  MatRadioButton,
  MatRadioGroup,
  MatRipple,
  MatSlider,
  MatSlideToggle,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPanelComponent } from '../../color/color-panel/color-panel.component';
import { ColorPickerContentComponent } from '../../color/color-panel/color-picker-content/color-picker-content.component';
import { ColorPickerItemComponent } from '../../color/color-panel/color-picker-item/color-picker-item.component';

describe('EraserPanelComponent', () => {
  let component: EraserPanelComponent;
  let fixture: ComponentFixture<EraserPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [
        EraserPanelComponent,
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
        MatCard
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EraserPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onThicknessChange should change the slider and'
    + 'update the service', () => {
    // tslint:disable: no-string-literal
    const spy = spyOn(component['eraserForm'], 'patchValue');
    const newValue = 25;
    component['sizeSlider'].value = newValue;
    component['onThicknessChange']();
    expect(spy).toHaveBeenCalled();
    expect(component['service'].size).toEqual(newValue);
  });
});
