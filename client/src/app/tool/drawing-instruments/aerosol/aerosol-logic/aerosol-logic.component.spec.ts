import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AerosolLogicComponent } from './aerosol-logic.component';

describe('AerosolLogicComponent', () => {
  let component: AerosolLogicComponent;
  let fixture: ComponentFixture<AerosolLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AerosolLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AerosolLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
