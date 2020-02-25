import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushComponent } from './brush.component';

describe('BrushComponent', () => {
  let component: BrushComponent;
  let fixture: ComponentFixture<BrushComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrushComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
