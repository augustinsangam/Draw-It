import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolLogicComponent } from './tool-logic.component';

describe('ToolLogicComponent', () => {
  let component: ToolLogicComponent;
  let fixture: ComponentFixture<ToolLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
