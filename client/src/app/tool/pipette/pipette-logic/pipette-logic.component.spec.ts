import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipetteLogicComponent } from './pipette-logic.component';

describe('PipetteLogicComponent', () => {
  let component: PipetteLogicComponent;
  let fixture: ComponentFixture<PipetteLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipetteLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipetteLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
