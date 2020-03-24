import { CdkObserveContent } from '@angular/cdk/observers';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCard, MatCardContent, MatCardTitle, MatFormField, MatIcon, MatInput,
  MatRadioButton, MatRadioGroup, MatRipple, MatSlider, MatSlideToggle
} from '@angular/material';
import { MatSlideToggleChange} from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ColorPanelComponent
} from '../../../color/color-panel/color-panel.component';
import {
  ColorPickerContentComponent
} from '../../../color/color-panel/color-picker-content/color-picker-content.component';
import {
  ColorPickerItemComponent
} from '../../../color/color-panel/color-picker-item/color-picker-item.component';
import { RectanglePanelComponent } from './rectangle-panel.component';

// tslint:disable: no-string-literal
describe('RectanglePanelComponent', () => {
  let component: RectanglePanelComponent;
  let fixture: ComponentFixture<RectanglePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [
        CdkObserveContent,
        RectanglePanelComponent,
        MatInput,
        MatFormField,
        ColorPanelComponent,
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
      ],
      schemas: [],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectanglePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onThicknessChangeshould call the method' +
    ' pathValue of rectangleForm', () => {
    const spy = spyOn(component['rectangleForm'], 'patchValue');
    component['onThicknessChange']();
    expect(spy).toHaveBeenCalled();
  });

  it('#ngAfterViewChecked should have subscribed' +
    'borderOption and fillOption, and these values should ' +
    'change when MatSlideToggle changes to false',
  () => {
    component.ngAfterViewChecked();
    component['borderOptionRef'].change.emit(
      new MatSlideToggleChange(component['borderOptionRef'], false)
    );
    component['fillOptionRef'].change.emit(
      new MatSlideToggleChange(component['fillOptionRef'], false)
    );
    expect(component['service'].borderOption).toBeFalsy();
    expect(component['service'].fillOption).toBeFalsy();
  });

  it('#ngAfterViewChecked should have subscribed' +
    'borderOption and fillOption, and these values should ' +
    'change when MatSlideToggle changes to true',
  () => {
    component.ngAfterViewChecked();
    component['borderOptionRef'].change.emit(
      new MatSlideToggleChange(component['borderOptionRef'], true)
    );
    component['fillOptionRef'].change.emit(
      new MatSlideToggleChange(component['fillOptionRef'], true)
    );
    expect(component['service'].borderOption).toBeTruthy();
    expect(component['service'].fillOption).toBeTruthy();
  });

});
