import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicatorPanelComponent } from './applicator-panel.component';

describe('ApplicatorPanelComponent', () => {
  let component: ApplicatorPanelComponent;
  let fixture: ComponentFixture<ApplicatorPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicatorPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicatorPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
