import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridPanelComponent } from './grid-panel.component';

fdescribe('GridPanelComponent', () => {
  let component: GridPanelComponent;
  let fixture: ComponentFixture<GridPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
