import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import { MatSliderChange } from '@angular/material';
import {
  MockColorPickerContentComponent
} from './mock-color-picker-content.component';

describe('MockColorPickerContentComponent', () => {
  let component: MockColorPickerContentComponent;
  let fixture: ComponentFixture<MockColorPickerContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockColorPickerContentComponent],
      imports: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockColorPickerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and Functions should at least launch', () => {
    expect(component).toBeTruthy();
    component.initialiseStartingColor();
    component.buildCanvas(1);
    component.onSlide(('' as unknown) as MatSliderChange);
    component.placeSlider(2);
    component.onChangeR(('' as unknown) as Event);
    component.onChangeG(('' as unknown) as Event);
    component.onChangeB(('' as unknown) as Event);
    component.onChangeA(('' as unknown) as Event);
    component.onChangeHex(('' as unknown) as Event);
    component.drawTracker(1, 1);
    component.reDrawTracker();
    component.updateHex();
    component.getActualRgba();
    component.onConfirm();
    MockColorPickerContentComponent.ValidatorHex(
      ('' as unknown) as AbstractControl
    );
    MockColorPickerContentComponent.ValidatorInteger(
      ('' as unknown) as AbstractControl
    );
  });
});
