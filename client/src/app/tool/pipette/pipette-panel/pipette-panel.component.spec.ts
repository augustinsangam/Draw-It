import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipettePanelComponent } from './pipette-panel.component';

describe('PipettePanelComponent', () => {
  let component: PipettePanelComponent;
  let fixture: ComponentFixture<PipettePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipettePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipettePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
