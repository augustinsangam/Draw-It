import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintSealPanelComponent } from './paint-seal-panel.component';

describe('PaintSealPanelComponent', () => {
  let component: PaintSealPanelComponent;
  let fixture: ComponentFixture<PaintSealPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaintSealPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintSealPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
