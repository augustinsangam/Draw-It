import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicatorLogicComponent } from './applicator-logic.component';

describe('ApplicatorLogicComponent', () => {
  let component: ApplicatorLogicComponent;
  let fixture: ComponentFixture<ApplicatorLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicatorLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicatorLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
