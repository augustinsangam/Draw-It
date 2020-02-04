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

  it('#MakeFirstPoint should set the good value to path', fakeAsync(() => {
    const mouseEv: MouseEvent = new MouseEvent('mousedown', {offsetX: 10, offsetY: 30, button: 0} as MouseEventInit);
    const pathExpected: string = 'M' + mouseEv.offsetX + ',' + mouseEv.offsetY + ' h0';
    component.makeFirstPoint(mouseEv);
    expect(component.stringPath).toEqual(pathExpected);
  }));

  it('#MakeFirstPoint shouldnt set the value if the left button isnt hold', fakeAsync(() => {
    const mouseEv: MouseEvent = new MouseEvent('mousedown', {offsetX: 10, offsetY: 30, button: 1} as MouseEventInit);
    const pathExpected: string = '';
    component.makeFirstPoint(mouseEv);
    expect(component.stringPath).toEqual(pathExpected);
  }));

  it('#drawing should set the good value to path', fakeAsync(() => {
    const mouseEv: MouseEvent = new MouseEvent('mousedown', {offsetX: 10, offsetY: 30, button: 0} as MouseEventInit);
    let pathExpected: string = ' L' + mouseEv.offsetX + ',' + mouseEv.offsetY;
    pathExpected += ' M' + mouseEv.offsetX + ',' + mouseEv.offsetY;
    component.drawing(mouseEv);
    expect(component.stringPath).toEqual(pathExpected);
  }));

  it('#drawing shouldnt set value to path if the left button is unhold', fakeAsync(() => {
    const mouseEv: MouseEvent = new MouseEvent('mouseup', {offsetX: 10, offsetY: 30, button: 2} as MouseEventInit);
    component.svgElRef.nativeElement.dispatchEvent(mouseEv);
    const pathExpected: string = '';
    component.drawing(mouseEv);
    expect(component.stringPath).toEqual(pathExpected);
  }));
  it('#configureSvgElement is making good configurations', fakeAsync(() => {

    const anElement: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    component.onMouseDown(new MouseEvent('mousedown', {offsetX: 10, offsetY: 30, button: 0} as MouseEventInit));
    component.configureSvgElement(anElement);
    expect(anElement.getAttribute('stroke-width')).toEqual(component.strokeWidth.toString());
    expect(anElement.getAttribute('stroke-linecap')).toEqual(component.strokeLineCap.toString());
  }));

  it('#defineParameter is making good configurations', fakeAsync(() => {
    component.defineParameter();
    expect(component.stroke).toEqual(component.colorService.primaryColor);
    expect(component.strokeWidth).toEqual(component.pencilService.thickness);

  }));

  it('#mouseMove should set the good value to th svgPath', fakeAsync(() => {
    const mouseEv: MouseEvent = new MouseEvent('mouseup', {offsetX: 10, offsetY: 30, button: 2} as MouseEventInit);
    component.onMouseMove(mouseEv);
    let pathExpected: string = ' L' + mouseEv.offsetX + ',' + mouseEv.offsetY;
    pathExpected += ' M' + mouseEv.offsetX + ',' + mouseEv.offsetY;
    expect(component.stringPath).toEqual(pathExpected);
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
      expect(spy).toHaveBeenCalled();
    }, 500);
    tick(500);
  }));

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

  it('#should reset the values of stringPath and mouseOnHold when mouse is up', fakeAsync(() => {
    component.svgElRef.nativeElement.dispatchEvent(
      new MouseEvent('mouseup', {} as MouseEventInit));
    setTimeout(() => {
      expect(component.stringPath).toEqual('');
    }, 500);
    tick(500);

  }));

  it('#should updates stringPath values when mouse is leaving', fakeAsync(() => {
    component.svgElRef.nativeElement.dispatchEvent(
      new MouseEvent('mousedown', {
        offsetX: 10,
        offsetY: 30,
        button: 0
      } as MouseEventInit)
    );

    component.svgElRef.nativeElement.dispatchEvent(
      new MouseEvent('mouseleave', {button: 0} as MouseEventInit));
    setTimeout(() => {
      expect(component.stringPath).toEqual('');
    }, 1000);
    tick(1000);
  }));

  it('# onMouseMove shouldnt updates stringPath values when mouse isnt hold', fakeAsync(() => {
    const mouseEv: MouseEvent = new MouseEvent('mousemove', {offsetX: 10, offsetY: 30, button: 0} as MouseEventInit);
    component.onMouseDown(mouseEv);
    component.svgElRef.nativeElement.dispatchEvent(mouseEv);
    const pathExpected: string = 'M' + mouseEv.offsetX + ',' + mouseEv.offsetY + ' h0';
    setTimeout(() => {
      expect(component.stringPath).toEqual(pathExpected);
    }, 1000);
    tick(1000);
  }));

  it('# event mousemove shouldnt call onMouseMove method when mouse isnt hold', fakeAsync(() => {
    const spy = spyOn(component, 'onMouseMove');
    component.svgElRef.nativeElement.dispatchEvent(
      new MouseEvent('mousemove', {
        offsetX: 10,
        offsetY: 30,
        button: 0
      } as MouseEventInit)
    );
    setTimeout(() => {
      expect(spy).toHaveBeenCalledTimes(0);
    }, 1000);
    tick(1000);
  }));

});
