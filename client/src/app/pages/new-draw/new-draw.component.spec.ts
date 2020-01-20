import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDrawComponent } from './new-draw.component';

describe('NewDrawComponent', () => {
  let component: NewDrawComponent;
  let fixture: ComponentFixture<NewDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
