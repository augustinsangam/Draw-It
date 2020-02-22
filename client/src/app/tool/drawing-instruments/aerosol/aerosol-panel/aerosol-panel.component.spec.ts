import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AerosolPanelComponent } from './aerosol-panel.component';

describe('AerosolPanelComponent', () => {
  let component: AerosolPanelComponent;
  let fixture: ComponentFixture<AerosolPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AerosolPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AerosolPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
