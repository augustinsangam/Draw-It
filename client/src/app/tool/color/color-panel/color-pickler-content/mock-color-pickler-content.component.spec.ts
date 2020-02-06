import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import { MatSliderChange } from '@angular/material';
import { MockColorPicklerContentComponent } from './mock-color-pickler-content.component';

describe('ColorPicklerContentComponent', () => {
  let component: MockColorPicklerContentComponent;
  let fixture: ComponentFixture<MockColorPicklerContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockColorPicklerContentComponent,
      ],
      imports: [
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockColorPicklerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and Functions should at least launch', () => {
    expect(component).toBeTruthy();
    MockColorPicklerContentComponent.ValidatorHex('' as unknown as AbstractControl);
    MockColorPicklerContentComponent.ValidatorInteger('' as unknown as AbstractControl);
    component.initialiseStartingColor();
    component.buildCanvas(1);
    component.onSlide('' as unknown as MatSliderChange);
    component.placeSlider(2);
    component.onChangeR('' as unknown as Event);
    component.onChangeG('' as unknown as Event);
    component.onChangeB('' as unknown as Event);
    component.onChangeA('' as unknown as Event);
    component.onChangeHex('' as unknown as Event);
    component.drawTracker(1, 1);
    component.reDrawTracker();
    component.updateHex();
    component.getActualRgba();
    component.onConfirm();
  });

});
