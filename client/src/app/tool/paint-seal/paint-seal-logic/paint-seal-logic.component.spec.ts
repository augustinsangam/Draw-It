import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintSealLogicComponent } from './paint-seal-logic.component';

describe('PaintSealLogicComponent', () => {
  let component: PaintSealLogicComponent;
  let fixture: ComponentFixture<PaintSealLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaintSealLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintSealLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
