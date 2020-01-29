import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushPanelComponent } from './brush-panel.component';

describe('BrushPanelComponent', () => {
  let component: BrushPanelComponent;
  let fixture: ComponentFixture<BrushPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrushPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrushPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
