import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolygonePanelComponent } from './polygone-panel.component';

describe('PolygonePanelComponent', () => {
  let component: PolygonePanelComponent;
  let fixture: ComponentFixture<PolygonePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolygonePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolygonePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
