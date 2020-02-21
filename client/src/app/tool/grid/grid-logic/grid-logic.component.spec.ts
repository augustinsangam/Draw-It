import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridLogicComponent } from './grid-logic.component';

describe('GridLogicComponent', () => {
  let component: GridLogicComponent;
  let fixture: ComponentFixture<GridLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
