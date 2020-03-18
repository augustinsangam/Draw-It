import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextLogicComponent } from './text-logic.component';

describe('TextLogicComponent', () => {
  let component: TextLogicComponent;
  let fixture: ComponentFixture<TextLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
