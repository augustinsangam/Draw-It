import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EraserPanelComponent } from './eraser-panel.component';

describe('EraserPanelComponent', () => {
  let component: EraserPanelComponent;
  let fixture: ComponentFixture<EraserPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EraserPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EraserPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
