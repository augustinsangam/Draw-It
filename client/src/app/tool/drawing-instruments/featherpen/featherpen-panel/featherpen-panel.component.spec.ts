import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatherpenPanelComponent } from './featherpen-panel.component';

describe('FeatherpenPanelComponent', () => {
  let component: FeatherpenPanelComponent;
  let fixture: ComponentFixture<FeatherpenPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatherpenPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatherpenPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
