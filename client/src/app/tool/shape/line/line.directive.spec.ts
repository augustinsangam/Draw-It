// tslint:disable:no-string-literal

import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineDirective } from './line.directive';

@Component({
  template: '<svg appLine><g id="zone"></g></svg>',
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

  it('should create an instance', () => expect(directive).toBeTruthy());

  it('should assign drawZone',
    () => expect(directive['drawZone']).toBeTruthy());

  it('should listen on mouse click', () => {
    const globMouseEv = new MouseEvent('click');
    spyOn<any>(directive, 'onMouseClick').and.callFake(
      (mouseEv: MouseEvent) => expect(mouseEv).toBe(globMouseEv));
    directive['elementRef'].nativeElement.dispatchEvent(globMouseEv);
  });

  it('should listen on mouse double click', () => {
    const globMouseEv = new MouseEvent('dblclick');
    spyOn<any>(directive, 'onMouseDblClick').and.callFake(
      (mouseEv: MouseEvent) => expect(mouseEv).toBe(globMouseEv));
    directive['elementRef'].nativeElement.dispatchEvent(globMouseEv);
  });

  it('should listen on mouse move', () => {
    const globMouseEv = new MouseEvent('mousemove');
    spyOn<any>(directive, 'onMouseMove').and.callFake(
      (mouseEv: MouseEvent) => expect(mouseEv).toBe(globMouseEv));
    directive['elementRef'].nativeElement.dispatchEvent(globMouseEv);
  });

  it('should listen on key down', () => {
    const globKeyEv = new KeyboardEvent('keydown');
    spyOn<any>(directive, 'onKeyDown').and.callFake(
      (keyEv: KeyboardEvent) => expect(keyEv).toBe(globKeyEv));
    directive['elementRef'].nativeElement.dispatchEvent(globKeyEv);
  });

  it('should listen on key up', () => {
    const globKeyEv = new KeyboardEvent('keyup');
    spyOn<any>(directive, 'onKeyUp').and.callFake(
      (keyEv: KeyboardEvent) => expect(keyEv).toBe(globKeyEv));
    directive['elementRef'].nativeElement.dispatchEvent(globKeyEv);
  });
});
