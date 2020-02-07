import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ElementRef, Renderer2 } from '@angular/core';
import { ColorService } from '../../color/color.service';
import { BrushService } from '../brush.service';
import { BrushLogicComponent } from './brush-logic.component';

describe('BrushLogicComponent', () => {
  let component: BrushLogicComponent;
  let fixture: ComponentFixture<BrushLogicComponent>;
  let mouseEvLeft: MouseEvent;
  let mouseEvRight: MouseEvent;
  let mouseMoveEvLeft: MouseEvent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrushLogicComponent ],
      providers: [Renderer2, ColorService, BrushService]
    })
    .compileComponents();

    mouseEvLeft = new MouseEvent('mousedown', {
      button: 0,
      offsetX: 10,
      offsetY: 30,
    } as MouseEventInit);

    mouseEvRight = new MouseEvent('mousedown', {
      button: 2,
      offsetX: 10,
      offsetY: 30,
    } as MouseEventInit);

    mouseMoveEvLeft = new MouseEvent('mousemove', {
      offsetX: 10,
      offsetY: 30,
      button: 0 } as MouseEventInit
    );

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
    const anPathElement: SVGPathElement =
      document.createElementNS('http://www.w3.org/2000/svg', 'path');
    component.configureSvgElement(anPathElement);
    expect(anPathElement.getAttribute('d')).toEqual(pathExpected);
  }));

  it ('#onMouseMove should set the good value to svgPath', fakeAsync(() => {
    component.svgElRef.nativeElement.dispatchEvent(mouseEvLeft);
    component.onMouseMove(mouseMoveEvLeft);
    expect(component.svgPath.getAttribute('d')).toEqual(component.stringPath);
  }));

  it('#should trigger onMouseDown method when mouse is down', fakeAsync(() => {
        const spy = spyOn(component, 'onMouseDown');
        component.svgElRef.nativeElement.dispatchEvent(mouseEvLeft);
        setTimeout(() => {
        expect(spy).toHaveBeenCalled();
        }, 500);
        tick(500);
  }));

  it('#shouldnt trigger onMouseDown method '
    + 'when left button is unhold', fakeAsync(() => {
        const spy = spyOn(component, 'onMouseDown');
        component.svgElRef.nativeElement.dispatchEvent(mouseEvRight);
        setTimeout(() => {
            expect(spy).toHaveBeenCalledTimes(0)
        }, 500);
        tick(500);
  }));

  it('#should call onMouseMove method when mouse is moving', fakeAsync(() => {
        const spy = spyOn(component, 'onMouseMove');
        component.mouseOnHold = true;
        component.svgElRef.nativeElement.dispatchEvent(mouseMoveEvLeft);
        setTimeout(() => {
          expect(spy).toHaveBeenCalledTimes(1);
        }, 1000);
        tick(1000);
  }));

  it('#onMouseMove shouldnt updates stringPath values '
    + 'when left mouse button isnt hold', fakeAsync(() => {
        component.mouseOnHold = true;
        component.svgElRef.nativeElement.dispatchEvent(mouseEvRight);
        const pathExpected = '';
        setTimeout(() => {
          expect(component.stringPath).toEqual(pathExpected);
        }, 1000);
        tick(1000);
  }));

  it('#onMouseMove shouldnt be called '
    + 'when left button isnt hold', fakeAsync(() => {
    const spy = spyOn(component, 'onMouseMove');
    component.svgElRef.nativeElement.dispatchEvent(mouseMoveEvLeft);
    setTimeout(() => {
      expect(spy).toHaveBeenCalledTimes(0);
    }, 1000);
    tick(1000);
  }));

  it('#drawing should set the good values to the stringPath', fakeAsync(() => {
    component.drawing(mouseMoveEvLeft);
    let pathExpected: string = ' L' + mouseMoveEvLeft.offsetX ;
    pathExpected += ',' + mouseMoveEvLeft.offsetY + ' M' ;
    pathExpected += mouseMoveEvLeft.offsetX + ',' + mouseMoveEvLeft.offsetY;
    setTimeout(() => {
      expect(component.stringPath).toEqual(pathExpected);
    }, 1000);
    tick(1000);
  }));

  it('#should reset the values of stringPath '
    + 'and mouseOnHold when mouse is up', fakeAsync(() => {
        component.svgElRef.nativeElement.dispatchEvent(
          new MouseEvent('mouseup', {} as MouseEventInit));
        setTimeout(() => {
          expect(component.stringPath).toEqual('');
          expect(component.mouseOnHold).toEqual(false);
        }, 500);
        tick(500);
  }));

  it('#onMouseMove should be triggered when'
    + ' the mousemove event is launched', fakeAsync(() => {
      const spy = spyOn(component, 'onMouseMove');
      component.mouseOnHold = true;
      component.svgElRef.nativeElement.dispatchEvent(mouseMoveEvLeft);
      setTimeout(() => {
        expect(spy).toHaveBeenCalledTimes(1);
      }, 1000);
      tick(1000);
  }));

  it('#should updates stringPath when mouse is leaving', fakeAsync(() => {
        component.mouseOnHold = true;
        component.svgElRef.nativeElement.dispatchEvent(
          new MouseEvent('mouseleave', { button: 0 } as MouseEventInit));
        setTimeout(() => {expect(component.stringPath).toEqual('')}, 1000);
        tick(1000);
  }));

  it('#mouseleave event shouldnt updates stringPath'
    + ' when left button is unhold', fakeAsync(() => {
        component.onMouseDown(mouseEvLeft);
        let pathExpected: string = 'M' + mouseEvLeft.offsetX ;
        pathExpected += ',' + mouseEvLeft.offsetY + ' h0';
        component.svgElRef.nativeElement.dispatchEvent(
          new MouseEvent('mouseleave', { button: 2 } as MouseEventInit));
        setTimeout(() => {
          expect(component.stringPath).toEqual(pathExpected);
        }, 1000);
        tick(1000);
  }));

});
