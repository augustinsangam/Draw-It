import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPicklerContentComponent } from './color-pickler-content.component';

describe('ColorPicklerContentComponent', () => {
  let component: ColorPicklerContentComponent;
  let fixture: ComponentFixture<ColorPicklerContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPicklerContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPicklerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
