import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolDirective } from './tool.directive';

@Component({
  template: '<svg appTool><g id="zone"></g></svg>',
})
class TestComponent {
  @ViewChild(ToolDirective) child: ToolDirective;
}

describe('ToolDirective', () => {
  let component: TestComponent;
  let directive: ToolDirective;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        ToolDirective,
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
