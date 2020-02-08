/* tslint:disable:no-string-literal */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import { ElementRef } from '@angular/core';
import {Point} from '../../tool-common classes/Point';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineLogicComponent } from './line-logic.component';
import {Path} from './Path';

describe('LineLogicComponent', () => {
  let component: LineLogicComponent;
  let fixture: ComponentFixture<LineLogicComponent>;
  let defaultPath: Path;

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

    defaultPath = new Path(
      {x: 42, y: 42},
      component['renderer'],
      component['renderer'].createElement('path', component['svgNS']),
      true
    );

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

  it('createNewPath devrait appeler getPath', () => {
      const spy = spyOn(component, 'getPath').and.callThrough();
      component['isNewPath'] = true;
      component['paths'] = [];
      component.createNewPath({x: 100, y: 100});
      expect(spy).toHaveBeenCalled();
  });

  it('getPath devrait retourner le path contenant les points passés en paramètre', () => {
    component['paths'] = [];
    component['paths'].push(defaultPath);
    expect(component.getPath().datas.points).toEqual([{x: 42, y: 42}]);
  });

  it('addNewLine devrait appeler addLine du path de line-logic', () => {
    component.onMouseDown(new MouseEvent(
      'mousedown',
      {clientX: 100, clientY: 100, button: 0} as MouseEventInit)
    );
    const spy = spyOn(component.getPath(), 'addLine');
    component.addNewLine({x: 100, y: 100});
    expect(spy).toHaveBeenCalled();
  });

  it('onMouseDown devrait appeler isNewLine et ' +
    'setter isNewPath à false lorsque Shift n\'est pas pressé', () => {
    const spy = spyOn(component, 'addNewLine');
    component['isNewPath'] = true;
    component.onMouseDown(new MouseEvent(
      'mousedown',
      {clientX: 100, clientY: 100, button: 0, shiftKey: false} as MouseEventInit)
    );
    expect(spy).toHaveBeenCalled();
    expect(component['isNewPath']).toBeFalsy();
  });

  it('onMouseDown devrait appeler getAlignedPoint et ' +
    'setter isNewPath à false lorsque Shift est pressé', () => {
    component['paths'].push(defaultPath);
    const spy = spyOn(component['paths'][0], 'getAlignedPoint').and.callFake((): Point => ({x: 100, y: 100}));
    spyOn(component, 'addNewLine');
    component['isNewPath'] = false;
    component.onMouseDown(new MouseEvent(
      'mousedown',
      {clientX: 100, clientY: 100, button: 0, shiftKey: true} as MouseEventInit)
    );
    expect(spy).toHaveBeenCalled();
    expect(component['isNewPath']).toBeFalsy();
  });

  it('onMouseMove devrait appeler getPath 1 seule fois' +
    ' lorsque SHIFT n\'est pas pressé', () => {
    component['isNewPath'] = false;
    component['paths'] = [];
    component['paths'].push(defaultPath);
    const spy = spyOn(component, 'getPath').and.callThrough();
    component.onMouseMove(new MouseEvent(
      'mousemove',
      {clientX: 100, clientY: 100, button: 0, shiftKey: false} as MouseEventInit)
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('onMouseMove devrait appeler getPath 2 fois' +
    ' lorsque SHIFT est pressé', () => {
    component['isNewPath'] = false;
    component['paths'] = [];
    component['paths'].push(defaultPath);
    const spy = spyOn(component, 'getPath').and.callThrough();
    component.onMouseMove(new MouseEvent(
      'mousemove',
      {clientX: 100, clientY: 100, button: 0, shiftKey: true} as MouseEventInit)
    );
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('onMouseUp devrait setter isNewPath à true pour un point à plus de 3 pixels', () => {
    component['paths'] = [];
    component['paths'].push(defaultPath);
    defaultPath.datas.points = [];
    defaultPath.datas.points.push({x: 42, y: 42});

    component.onMouseUp(new MouseEvent(
      'mouseup',
      {clientX: 100, clientY: 100, button: 0, shiftKey: false})
    );

    expect(component['isNewPath']).toBeTruthy();
  });

  it('onMouseUp devrait seter isNewPath à true et appeler getPath ' +
    '5 fois pour un point à plus de 3 pixels et lorsqu\'on appuie sur shift', () => {
    component['paths'] = [];
    component['paths'].push(defaultPath);
    component['isNewPath'] = false;

    spyOn(component['mathService'], 'distanceIsLessThan3Pixel').and.callFake(() => false);
    spyOn(component['mathService'], 'findAlignedSegmentPoint');
    spyOn(component['paths'][0], 'getAlignedPoint').and.callFake((): Point => ({x: 300, y: 300}));
    const spy = spyOn(component, 'addNewLine');

    component.onMouseUp(new MouseEvent(
      'mouseup',
      {clientX: 100, clientY: 100, button: 0, shiftKey: true})
    );

    expect(spy).toHaveBeenCalled();
    expect(component['isNewPath']).toBeTruthy();
  });

  it('onMouseUp devrait appeler 5 fois getPath pour un point à moins de 3 pixels', () => {
    component['isNewPath'] = false;

    component['paths'] = [];
    component['paths'].push(defaultPath);

    const spy = spyOn(component, 'getPath').and.callThrough();
    spyOn(component['mathService'], 'distanceIsLessThan3Pixel').and.callFake(() => true);

    component.onMouseUp(new MouseEvent(
      'mouseup',
      {clientX: 43, clientY: 43, button: 0, shiftKey: false})
    );

    expect(component['isNewPath']).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(4);
  });

  it('onKeyDown devrait appeler 2 fois la méthode getPath lorsqu\'elle est appelée avec Shift', () => {
    component['isNewPath'] = false;
    component['paths'] = [];
    component['paths'].push(defaultPath);
    spyOn(component.getPath(), 'getAlignedPoint').and.callFake((): Point => ({x: 10, y: 10}));
    const spy = spyOn(component, 'getPath').and.callThrough();

    component.onKeyDown(new KeyboardEvent(
      'shift',
      {code: 'ShiftLeft'}
    ));
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('onKeyDown devrait appeler 1 fois la méthode getPath lorsqu\'elle est appelée ' +
    'avec Escape, et devrait set isNewPath à true', () => {
    component['isNewPath'] = false;
    component['paths'] = [];
    component['paths'].push(defaultPath);
    const spy = spyOn(component.getPath(), 'removePath');

    component.onKeyDown(new KeyboardEvent(
      'escape',
      {code: 'Escape'}
    ));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component['isNewPath']).toBeTruthy();
  });

  it('onKeyDown devrait appeler les métthodes removeLastLine et ' +
    'simulateNewLine lorsqu\'elle est appelée avec Backspace', () => {
    defaultPath.datas.points = [];
    defaultPath.datas.points.push({x: 42, y: 42});
    defaultPath.datas.points.push({x: 404, y: 404});
    component['paths'] = [];
    component['paths'].push(defaultPath);
    const spyRemo = spyOn(component.getPath(), 'removeLastLine');
    const spySimu = spyOn(component.getPath(), 'simulateNewLine').and.callFake((): Point => ({x: 10, y: 10}));

    component.onKeyDown(new KeyboardEvent(
      'backspace',
      {code: 'Backspace'}
    ));
    expect(spyRemo).toHaveBeenCalled();
    expect(spySimu).toHaveBeenCalled();
  });

  it('onKeyUp devrait appeler simulateNewLine si elle est appelée avec ShiftLeft', () => {
    component['isNewPath'] = false;
    const spy = spyOn(component, 'getPath').and.callFake(() => defaultPath);
    spyOn(component.getPath(), 'simulateNewLine');

    component.onKeyUp(new KeyboardEvent(
      'shift',
      {code: 'ShiftLeft'}
    ));

    expect(spy).toHaveBeenCalled();
  });

  it('onKeyUp devrait appeler simulateNewLine si elle est appelée avec ShiftRight', () => {
    component['isNewPath'] = false;
    const spy = spyOn(component, 'getPath').and.callFake(() => defaultPath);
    spyOn(component.getPath(), 'simulateNewLine');

    component.onKeyUp(new KeyboardEvent(
      'shift',
      {code: 'ShiftRight'}
    ));

    expect(spy).toHaveBeenCalled();
  });

  it('ngOnDestroy devrait rendre called à true ' +
    '(= appeler toutes les fonctions de l\'objet listener)', () => {
    let called = false;
    component['listeners'] = [
      () => called = true
    ];
    component.ngOnDestroy();
    expect(called).toBeTruthy();
  });

});
