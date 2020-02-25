import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PencilDirective } from './pencil.directive';

@Component({
  template: '<svg appPencil><g id="zone"></g></svg>',
})
class TestComponent {
  @ViewChild(PencilDirective) child: PencilDirective;
}

describe('PencilDirective', () => {
  let component: TestComponent;
  let directive: PencilDirective;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PencilDirective,
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
