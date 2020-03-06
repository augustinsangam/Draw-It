import { CdkObserveContent } from '@angular/cdk/observers';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCard, MatCardContent, MatCardTitle, MatFormField, MatIcon, MatInput,
  MatRadioButton, MatRadioGroup, MatRipple, MatSlider, MatSlideToggle, MatSlideToggleChange
} from '@angular/material';
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
import { PolygonePanelComponent } from './polygone-panel.component';

// TODO : Ask the chargé de lab
// tslint:disable: no-string-literal
describe('PolygonePanelComponent', () => {
  let component: PolygonePanelComponent;
  let fixture: ComponentFixture<PolygonePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [
        CdkObserveContent,
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
        MatCardTitle,
        PolygonePanelComponent
      ],
      schemas: [],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolygonePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onThicknessChange devrait appeler la \
    méthode patchValue de rectangleForm', () => {
    const spy = spyOn(component['polygoneForm'], 'patchValue');
    component['onThicknessChange']();
    expect(spy).toHaveBeenCalled();
  });

  it('onSidesChange devrait appeler la \
    méthode patchValue de rectangleForm', () => {
    const spy = spyOn(component['polygoneForm'], 'patchValue');
    component['onSidesChange']();
    expect(spy).toHaveBeenCalled();
  });

  it('ngAfterViewChecked devrait avoir subscribed' +
    'borderOption et fillOption, et ces valeurs devraient ' +
    'changer dans le service lorsqu\'on émet un MatSlideToggleChange en false',
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

  it('ngAfterViewChecked devrait avoir subscribed borderOption'
  + ' et fillOption, et ces valeurs devraient ' +
    'changer dans le service lorsqu\'on émet un MatSlideToggleChange en true',
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
