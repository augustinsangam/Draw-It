import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ElementRef, Renderer2 } from '@angular/core';
import { ColorService } from '../../color/color.service';
import { PencilService } from '../pencil.service';
import { PencilLogicComponent } from './pencil-logic.component';

fdescribe('PencilLogicComponent', () => {
  let component: PencilLogicComponent;
  let fixture: ComponentFixture<PencilLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PencilLogicComponent],
      providers: [Renderer2, ColorService, PencilService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencilLogicComponent);
    component = fixture.componentInstance;
    component.svgElRef = new ElementRef<SVGElement>(
      document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#should trigger onMouseMove method when mouse is moving', fakeAsync(() => {
    const spy = spyOn(component, 'onMouseMove');
    component.svgElRef.nativeElement.dispatchEvent(
      new MouseEvent('mousedown', {
        offsetX: 10,
        offsetY: 30,
        button: 0
      } as MouseEventInit)
    );
    component.svgElRef.nativeElement.dispatchEvent(
      new MouseEvent('mousemove', {
        offsetX: 10,
        offsetY: 30,
        button: 0
      } as MouseEventInit)
    );
    setTimeout(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    }, 1000);
    tick(1000);
  }));

  it('#should trigger onMouseDown method when mouse is down', fakeAsync(() => {
    const spy = spyOn(component, 'onMouseDown');
    component.svgElRef.nativeElement.dispatchEvent(
      new MouseEvent('mousedown', {
        offsetX: 10,
        offsetY: 30,
        button: 0
      } as MouseEventInit)
    );
    setTimeout(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    }, 500);
    tick(500);

  }));

});
