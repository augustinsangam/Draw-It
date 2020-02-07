import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPicklerItemComponent } from './color-pickler-item.component';

describe('ColorPicklerItemComponent', () => {
  let component: ColorPicklerItemComponent;
  let fixture: ComponentFixture<ColorPicklerItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPicklerItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPicklerItemComponent);
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
