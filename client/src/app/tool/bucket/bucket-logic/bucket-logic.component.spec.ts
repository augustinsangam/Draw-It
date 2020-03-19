import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketLogicComponent } from './bucket-logic.component';

describe('BucketLogicComponent', () => {
  let component: BucketLogicComponent;
  let fixture: ComponentFixture<BucketLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BucketLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
