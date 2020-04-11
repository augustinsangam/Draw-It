import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatRippleModule} from '@angular/material/core';
import {MatIcon} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSlider} from '@angular/material/slider';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PanelComponent} from '../../../panel/panel.component';
import {ColorPanelComponent} from '../../color/color-panel/color-panel.component';
import {ColorPickerContentComponent} from '../../color/color-panel/color-picker-content/color-picker-content.component';
import {ColorPickerItemComponent} from '../../color/color-panel/color-picker-item/color-picker-item.component';
import {TextAlignement} from '../text-classes/text-alignement';
import { TextPanelComponent } from './text-panel.component';

// tslint:disable:no-string-literal no-magic-numbers no-any
describe('TextPanelComponent', () => {
  let component: TextPanelComponent;
  let fixture: ComponentFixture<TextPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TextPanelComponent,
        PanelComponent,
        ColorPanelComponent,
        ColorPickerContentComponent,
        ColorPickerItemComponent,
        MatIcon,
        MatButtonToggle,
        MatButtonToggleGroup,
        MatSlider,
        MatRadioButton,
        MatRadioGroup,
        MatCardTitle,
        MatCardContent,
        MatCard,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatRippleModule,
        MatInputModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onMutatorChange should call patchValue and set newMutators to the service', () => {
    const spy = spyOn(component['textForm'], 'patchValue');
    const mutTests = ['bold', 'bold', 'italic', 'italic', 'underline', 'underline'];
    mutTests.forEach((mut) => {
      component['onMutatorChange']({value: mut} as unknown as MatButtonToggleChange);
      expect(spy).toHaveBeenCalled();
    });
  });

  it('#onAlignChange should call patchValue and set the new alignement in the service', () => {
    const spy = spyOn(component['textForm'], 'patchValue');
    component['onAlignChange']({value: 'center'} as unknown as MatButtonToggleChange);
    expect(spy).toHaveBeenCalled();
    expect(component['service'].textAlignement).toEqual('center');
  });

  it('#onFontSizeChange should call patchValue and set the new alignement in the service', () => {
    const spy = spyOn(component['textForm'], 'patchValue');
    component['fontSizeSlider'].value = 14;
    component['onFontSizeChange']();
    expect(spy).toHaveBeenCalled();
    expect(component['service'].fontSize).toEqual(14);
  });

  it('#getPreviewTextAlign should return the correct values', () => {
    component['previewDims'] = {width: 10, height: 10};
    const alignements = [
      {value: 'left', result: 0},
      {value: 'center', result: 5},
      {value: 'right', result: 10},
    ];
    alignements.forEach((align) => {
      component['service'].textAlignement = align.value as TextAlignement;
      expect(component['getPreviewTextAlign']()).toEqual(align.result);
    });
  });

  it('#startTyping should be subscribed to the event emitter in the service', () => {
    const spy = spyOn<any>(component, 'startTyping');
    component['service'].startTypingEmitter.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('#endTyping should be subscribed to the event emitter in the service', () => {
    const spy = spyOn<any>(component, 'endTyping');
    component['service'].endTypingEmitter.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('#startTyping should set disabled to true', () => {
    component['fontSizeSlider'].disabled = false;
    component['startTyping']();
    expect(component['fontSizeSlider'].disabled).toBeTruthy();
  });

  it('endTyping should set disabled to false', () => {
    component['fontSizeSlider'].disabled = true;
    component['endTyping']();
    expect(component['fontSizeSlider'].disabled).toBeFalsy();
  });
});
