import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushDirective } from './brush.directive';

@Component({
  template: '<svg appBrush><g id="zone"></g><g id="end"></g></svg>',
})
class TestComponent {
  @ViewChild(BrushDirective) child: BrushDirective;
}

describe('BrushDirective', () => {
  let component: TestComponent;
  let directive: BrushDirective;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BrushDirective,
        TestComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => directive = component.child);

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
