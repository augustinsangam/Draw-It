import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ElementRef, Renderer2 } from '@angular/core';
import { ColorService } from '../../color/color.service';
import { BrushService } from '../brush.service';
import { BrushLogicComponent } from './brush-logic.component';

describe('BrushLogicComponent', () => {
  let component: BrushLogicComponent;
  let fixture: ComponentFixture<BrushLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrushLogicComponent ],
      providers: [Renderer2, ColorService, BrushService]
    })
    .compileComponents();
    // const mouseEvLeftButton: MouseEvent = new MouseEvent(
    //     'mousedown', { offsetX: 10, offsetY: 30, button: 0 } as MouseEventInit
    // );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrushLogicComponent);
    component = fixture.componentInstance;
    component.svgElRef = new ElementRef<SVGElement>(
        document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ConfigureSVGPath should set the good value', fakeAsync(() => {
    const pathExpected: string = 'M' + 13 + ',' + 15 + ' h0';
    component.stringPath = pathExpected;
    const anPathElement: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    component.configureSvgElement(anPathElement);
    expect(anPathElement.getAttribute('d')).toEqual(pathExpected);
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

  it('#shouldnt trigger onMouseDown method when left button is unhold', fakeAsync(() => {
        const spy = spyOn(component, 'onMouseDown');
        const mouseEv: MouseEvent = new MouseEvent('mousedown', { offsetX: 10, offsetY: 30, button: 2 } as MouseEventInit);
        component.svgElRef.nativeElement.dispatchEvent(mouseEv);
        setTimeout(() => {
            expect(spy).toHaveBeenCalledTimes(0)
        }, 500);
        tick(500);
    }));

  it('#should trigger onMouseMove method when mouse is moving', fakeAsync(() => {
        const spy = spyOn(component, 'onMouseMove');
        component.mouseOnHold = true;
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

  it('#onMouseMove shouldnt updates stringPath values when left mouse button isnt hold', fakeAsync(() => {
        const mouseEv: MouseEvent = new MouseEvent('mousemove', { offsetX: 10, offsetY: 30, button: 0 } as MouseEventInit);
        const mouseEvRight: MouseEvent = new MouseEvent('mousemove', { offsetX: 10, offsetY: 30, button: 2 } as MouseEventInit);
        component.onMouseDown(mouseEv);
        component.svgElRef.nativeElement.dispatchEvent(mouseEvRight);
        const pathExpected: string = 'M' + mouseEv.offsetX + ',' + mouseEv.offsetY + ' h0';
        setTimeout(() => {
          expect(component.stringPath).toEqual(pathExpected);
        }, 1000);
        tick(1000);
    }));

  it('#should reset the values of stringPath and mouseOnHold when mouse is up', fakeAsync(() => {
        component.svgElRef.nativeElement.dispatchEvent(
          new MouseEvent('mouseup', {} as MouseEventInit));
        setTimeout(() => {
          expect(component.stringPath).toEqual('');
          expect(component.mouseOnHold).toEqual(false);
        }, 500);
        tick(500);
    }));

  it('#should updates stringPath values when mouse is leaving', fakeAsync(() => {
        component.mouseOnHold = true;
        component.svgElRef.nativeElement.dispatchEvent(
          new MouseEvent('mouseleave', { button: 0 } as MouseEventInit));
        setTimeout(() => {expect(component.stringPath).toEqual('')}, 1000);
        tick(1000);
    }));
});
