import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPickerContentComponent } from './color-picker-content.component';

describe('ColorPickerContentComponent', () => {
  let component: ColorPickerContentComponent;
  let fixture: ComponentFixture<ColorPickerContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPickerContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
