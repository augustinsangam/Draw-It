import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RectanglePanelComponent } from './rectangle-panel.component';

describe('RectanglePanelComponent', () => {
  let component: RectanglePanelComponent;
  let fixture: ComponentFixture<RectanglePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectanglePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectanglePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
