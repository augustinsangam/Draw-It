import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorBoxComponent } from './color-box.component';

describe('ColorBoxComponent', () => {
  let component: ColorBoxComponent;
  let fixture: ComponentFixture<ColorBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
