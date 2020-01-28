import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PencilLogicComponent } from './pencil-logic.component';

describe('PencilLogicComponent', () => {
  let component: PencilLogicComponent;
  let fixture: ComponentFixture<PencilLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PencilLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencilLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
