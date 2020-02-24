import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ToolDirective } from './tool.directive';

@Component({
  template: '<svg:svg appTool></svg:svg>',
})
class TestComponent {}

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

  beforeEach(() => {
    const directiveEl = fixture.debugElement.query(By.directive(ToolDirective));
    directive = directiveEl.injector.get(ToolDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
