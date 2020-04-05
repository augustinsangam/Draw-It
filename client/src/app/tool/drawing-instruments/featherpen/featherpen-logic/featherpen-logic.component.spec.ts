import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {Point} from '../../../shape/common/point';
import {UndoRedoService} from '../../../undo-redo/undo-redo.service';
import { FeatherpenLogicComponent } from './featherpen-logic.component';

const createClickMouseEvent = (event: string): MouseEvent => {
  return new MouseEvent(event, {
    offsetX: 10,
    offsetY: 30,
    button: 0
  } as MouseEventInit);
};

// tslint:disable:no-string-literal no-magic-numbers no-any
describe('FeatherpenLogicComponent', () => {
  let component: FeatherpenLogicComponent;
  let fixture: ComponentFixture<FeatherpenLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatherpenLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatherpenLogicComponent);
    component = fixture.componentInstance;
    component.svgStructure = {
      root: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      defsZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      drawZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      temporaryZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      endZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement
    };
    component.svgStructure.root.appendChild(component.svgStructure.defsZone);
    component.svgStructure.root.appendChild(component.svgStructure.drawZone);
    component.svgStructure.root.appendChild(component.svgStructure.temporaryZone);
    component.svgStructure.root.appendChild(component.svgStructure.endZone);
    (TestBed.get(UndoRedoService) as UndoRedoService).intialise(component.svgStructure);

    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should have intialized the listeners', () => {
    component['listeners'] = [];
    component.ngOnInit();
    expect(component['listeners'].length).toEqual(5);
  });

  it('#a mousedown event should call the listener', () => {
    const spy = spyOn<any>(component, 'onMouseDown');
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mousedown'));
    expect(spy).toHaveBeenCalled();
  });

  it('#a mousemove event should call the listener', () => {
    const spy = spyOn<any>(component, 'onMouseMove');
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mousemove'));
    expect(spy).toHaveBeenCalled();
  });

  it('#a mouseup event should call the listener', () => {
    const spy = spyOn<any>(component, 'onMouseUp');
    document.dispatchEvent(createClickMouseEvent('mouseup'));
    expect(spy).toHaveBeenCalled();
  });

  it('#a mouseleave event should call the listener', () => {
    const spy = spyOn<any>(component, 'onMouseUp');
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mouseleave'));
    expect(spy).toHaveBeenCalled();
  });

  it('#a scroll event should call the listener', () => {
    const spy = spyOn<any>(component, 'onScroll');
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('wheel'));
    expect(spy).toHaveBeenCalled();
  });

  it('#if not on drag, mousedown should call setElementStyle', () => {
    const spy = spyOn<any>(component, 'setElementStyle');
    component['onDrag'] = false;
    component['onMouseDown'](createClickMouseEvent('mousedown'));
    expect(spy).toHaveBeenCalled();
  });

  it('#if on drag, mousedown should not do anything', () => {
    const spy = spyOn<any>(component, 'setElementStyle');
    component['onDrag'] = true;
    component['onMouseDown'](createClickMouseEvent('mousedown'));
    expect(spy).not.toHaveBeenCalled();
  });

  it('#setElementStyle should call setAttribute on the element', () => {
    component['onMouseDown'](createClickMouseEvent('mousedown'));
    const spy = spyOn(component['element'], 'setAttribute');
    component['setElementStyle']();
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseMove should call setAttribute on the element if on Drag', () => {
    component['onDrag'] = true;
    component['element'] = {setAttribute: () => true} as unknown as SVGElement;
    const spy = spyOn(component['element'], 'setAttribute');
    component['onMouseMove'](new Point(42, 69));
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseMove should not call setAttribute on the element if not on Drag', () => {
    component['onDrag'] = false;
    component['element'] = {setAttribute: () => true} as unknown as SVGElement;
    const spy = spyOn(component['element'], 'setAttribute');
    component['onMouseMove'](new Point(42, 69));
    expect(spy).not.toHaveBeenCalled();
  });

  it('#onMouseUp should call savestate and clear the currentPath when on drag', () => {
    component['currentPath'] = 'drawit';
    component['onDrag'] = true;
    const spy = spyOn(component['undoRedoService'], 'saveState');
    component['onMouseUp']();
    expect(component['currentPath']).toEqual('');
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseUp should do nothing when not on drag', () => {
    component['currentPath'] = 'drawit';
    component['onDrag'] = false;
    const spy = spyOn(component['undoRedoService'], 'saveState');
    component['onMouseUp']();
    expect(component['currentPath']).toEqual('drawit');
    expect(spy).not.toHaveBeenCalled();
  });

  it('#onScroll should call setAttribute on the element if onDrag', () => {
    component['onDrag'] = true;
    component['element'] = {setAttribute: () => true} as unknown as SVGElement;
    const spy = spyOn(component['element'], 'setAttribute');
    component['onScroll'](createClickMouseEvent('wheel') as WheelEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('#onScroll should only save the angle and do nothing when not on drag', () => {
    component['onDrag'] = false;
    component['element'] = {setAttribute: () => true} as unknown as SVGElement;
    const spy = spyOn(component['element'], 'setAttribute');
    component['onScroll'](createClickMouseEvent('wheel') as WheelEvent);
    expect(spy).not.toHaveBeenCalled();
  });

  it('#the override function should call the remove method of the element when called and when on drag', () => {
    component['onDrag'] = true;
    component['element'] = {remove: () => true} as unknown as SVGElement;
    const spy = spyOn(component['element'], 'remove');
    (component['undoRedoService']['actions'].undo[0].overrideFunction as () => void)();
    expect(spy).toHaveBeenCalled();
  });

  it('#the override function should not call the remove method of the element when called and when not on drag', () => {
    component['onDrag'] = false;
    component['element'] = {remove: () => true} as unknown as SVGElement;
    const spy = spyOn(component['element'], 'remove');
    (component['undoRedoService']['actions'].undo[0].overrideFunction as () => void)();
    expect(spy).not.toHaveBeenCalled();
  });

});
