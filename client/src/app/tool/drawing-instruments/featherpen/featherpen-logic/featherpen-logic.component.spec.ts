import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatherpenLogicComponent } from './featherpen-logic.component';

describe('FeatherpenLogicComponent', () => {
  let component: FeatherpenLogicComponent;
  let fixture: ComponentFixture<FeatherpenLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatherpenLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatherpenLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
