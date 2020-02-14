import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EllipsePanelComponent } from './ellipse-panel.component';

describe('EllipsePanelComponent', () => {
  let component: EllipsePanelComponent;
  let fixture: ComponentFixture<EllipsePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EllipsePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EllipsePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
