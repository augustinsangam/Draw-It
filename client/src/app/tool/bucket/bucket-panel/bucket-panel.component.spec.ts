import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketPanelComponent } from './bucket-panel.component';

describe('BucketPanelComponent', () => {
  let component: BucketPanelComponent;
  let fixture: ComponentFixture<BucketPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BucketPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
