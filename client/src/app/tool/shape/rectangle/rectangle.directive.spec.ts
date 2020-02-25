import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RectangleDirective } from './rectangle.directive';

@Component({
  template: '<svg appRectangle><g id="zone"></g></svg>',
})
class TestComponent {
  @ViewChild(RectangleDirective) child: RectangleDirective;
}

describe('RectangleDirective', () => {
  let component: TestComponent;
  let directive: RectangleDirective;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RectangleDirective,
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
