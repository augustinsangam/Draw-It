import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPickerItemComponent } from './color-picker-item.component';

describe('ColorPickerItemComponent', () => {
  let component: ColorPickerItemComponent;
  let fixture: ComponentFixture<ColorPickerItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPickerItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#updateColor() should change the DOM background element', () => {
    component.updateColor('rgb(100, 100, 100)');
    expect(component.button.nativeElement.style.backgroundColor).toEqual('rgb(100, 100, 100)');
  });

});
