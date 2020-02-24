import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineDirective } from './line.directive';

@Component({
  template: '<svg:svg appLine></svg:svg>',
})
class TestComponent {
  @ViewChild(LineDirective) child: LineDirective;
}

describe('LineDirective', () => {
  let component: TestComponent;
  let directive: LineDirective;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LineDirective,
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
