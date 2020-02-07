// tslint:disable:no-string-literal

import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineLogicComponent } from './line-logic.component';

describe('LineLogicComponent', () => {
  let component: LineLogicComponent;
  let fixture: ComponentFixture<LineLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LineLogicComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineLogicComponent);
    component = fixture.componentInstance;
    component['svgElRef'] = new ElementRef<SVGElement>(
      document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle mouse click', () => {
    const globMouseEv = new MouseEvent('click');
    spyOn<any>(component, 'onMouseClick').and.callFake(
      (mouseEv: MouseEvent) => expect(mouseEv).toBe(globMouseEv));
    component.ngOnInit();
    component['svgElRef'].nativeElement.dispatchEvent(globMouseEv);
  });

  it('should handle mouse double click', () => {
    const globMouseEv = new MouseEvent('dblclick');
    spyOn<any>(component, 'onMouseDblClick').and.callFake(
      (mouseEv: MouseEvent) => expect(mouseEv).toBe(globMouseEv));
    component.ngOnInit();
    component['svgElRef'].nativeElement.dispatchEvent(globMouseEv);
  });

  it('should handle mouse move', () => {
    const globMouseEv = new MouseEvent('mousemove');
    spyOn<any>(component, 'onMouseMove').and.callFake(
      (mouseEv: MouseEvent) => expect(mouseEv).toBe(globMouseEv));
    component.ngOnInit();
    component['svgElRef'].nativeElement.dispatchEvent(globMouseEv);
  });

  it('should handle key downs', () => {
    const globKeyEv = new KeyboardEvent('keydown');
    spyOn<any>(component, 'onKeyDown').and.callFake(
      (keyEv: KeyboardEvent) => expect(keyEv).toBe(globKeyEv));
    component.ngOnInit();
    component['svgElRef'].nativeElement.dispatchEvent(globKeyEv);
  });

  it('should handle key ups', () => {
    const globKeyEv = new KeyboardEvent('keyup');
    spyOn<any>(component, 'onKeyUp').and.callFake(
      (keyEv: KeyboardEvent) => expect(keyEv).toBe(globKeyEv));
    component.ngOnInit();
    component['svgElRef'].nativeElement.dispatchEvent(globKeyEv);
  });
});
