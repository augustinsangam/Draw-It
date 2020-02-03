import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EllipseLogicComponent } from './ellipse-logic.component';

describe('EllipseLogicComponent', () => {
  let component: EllipseLogicComponent;
  let fixture: ComponentFixture<EllipseLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EllipseLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EllipseLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
