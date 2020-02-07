/* tslint:disable:no-string-literal */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import { ElementRef } from '@angular/core';
import { LineLogicComponent } from './line-logic.component';
import {Path} from './Path';

fdescribe('LineLogicComponent', () => {
  let component: LineLogicComponent;
  let fixture: ComponentFixture<LineLogicComponent>;
  let defaultPath: Path;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineLogicComponent);
    component = fixture.componentInstance;
    component.svgElRef = new ElementRef<SVGElement>(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
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

  it('onMouseUp devrait setter isNewPath à true', () => {
    component.onMouseDown(new MouseEvent(
      'mousedown',
      {clientX: 10, clientY: 10, button: 0, shiftKey: false}
    ));
    component.onMouseUp(new MouseEvent(
      'mouseup',
      {clientX: 100, clientY: 100, button: 0, shiftKey: false})
    );
    expect(component['isNewPath']).toBeTruthy();
  })

});
