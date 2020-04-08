import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Point } from '../../shape/common/point';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { CircleType } from './circle-type';
import { Scale } from './scale';
// import * as Util from './selection-logic-util';
import { SelectionLogicComponent } from './selection-logic.component';
import { Transform } from './transform';

// tslint:disable: no-magic-numbers no-string-literal no-any
fdescribe('Scale', () => {
  let component: SelectionLogicComponent;
  let fixture: ComponentFixture<SelectionLogicComponent>;
  let scale: Scale;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionLogicComponent ],
      providers: [
        Renderer2
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionLogicComponent);
    component = fixture.componentInstance;
    scale = component['scaleUtil'];
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

    const rec1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rec1.setAttribute('x', '2');
    rec1.setAttribute('y', '3');
    rec1.setAttribute('width', '100');
    rec1.setAttribute('height', '100');
    rec1.setAttribute('stroke-width', '5');
    const rec2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rec2.setAttribute('x', '22');
    rec2.setAttribute('y', '30');
    rec2.setAttribute('width', '100');
    rec2.setAttribute('height', '100');
    rec2.style.strokeWidth = '2';
    const rec3 = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rec3.classList.add('filter1');
    component.svgStructure.drawZone.appendChild(rec1);
    component.svgStructure.drawZone.appendChild(rec2);
    component.svgStructure.drawZone.appendChild(rec3);

    (TestBed.get(UndoRedoService) as UndoRedoService)
    .intialise(component.svgStructure);

    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(scale).toBeTruthy();
  });

  it('#onMouseDown should set baseTransform', () => {
    const element = component.svgStructure.drawZone.children.item(0) as SVGElement;
    const transform = new Transform(element, component.renderer);
    component.service.selectedElements.clear();
    component.service.selectedElements.add(element);

    const expectedMap = new Map<SVGElement, Transform>([[element, transform]]);

    scale.onMouseDown();

    expect(scale['baseTransform']).toEqual(expectedMap);
  });

  it('#onMouseDown should set baseVisualisationRectangleDimension and scaledRectangleDimension', () => {
    component.rectangles.visualisation.setAttribute('width', '100');
    component.rectangles.visualisation.setAttribute('height', '50');

    scale.onMouseDown();

    expect(scale['baseVisualisationRectangleDimension']).toEqual({width: 100, height: 50});
    expect(scale['scaledRectangleDimension']).toEqual({width: 100, height: 50});
  });

  it('#onMouseUp should clear baseTransform, reset inverted and scaleOffset', () => {
    const element = component.svgStructure.drawZone.children.item(0) as SVGElement;
    const transform = new Transform(element, component.renderer);

    scale['baseTransform'] = new Map<SVGElement, Transform>([[element, transform]]);
    scale['inverted'] = {x: -1, y: -1};
    scale['scaleOffset'] = {x: 100, y: 100};

    scale.onMouseUp();

    expect(scale['baseTransform']).toEqual(new Map());
    expect(scale['inverted']).toEqual({ x: 1, y: 1 });
    expect(scale['scaleOffset']).toEqual({ x: 0, y: 0 });
  });

  it('#onMouseMove should call onResize and resizeVisualisationRectangle', () => {
    const spyOnResize = spyOn<any>(scale, 'onResize');
    const spyResize = spyOn<any>(scale, 'resizeVisualisationRectangle');

    scale.onMouseMove({x: 10, y: 10} as Point);

    expect(spyOnResize).toHaveBeenCalled();
    expect(spyResize).toHaveBeenCalled();
  });

  it('#onResize should return the right mouseOffset and set scaledRectagleDimension properly', () => {
    spyOn<any>(scale, 'resizeAll').and.callFake(() => {return; });

    scale['scaledRectangleDimension'] = {width: 69, height: 69};
    scale['scaleOffset'] = new Point(0, 0);
    component.mouse.left.selectedElement = CircleType.LEFT_CIRCLE;

    component.mouse.left.currentPoint = new Point(42, 42);

    const previousCurrentPoint = new Point(0, 0);

    const valueReturned = scale['onResize'](previousCurrentPoint);

    expect(valueReturned).toEqual({x: 42, y: 0});
    expect(scale['scaledRectangleDimension']).toEqual({width: 27, height: 69});
  });

  it('#onResize should return the right mouseOffset and set scaledRectagleDimension properly', () => {
    spyOn<any>(scale, 'resizeAll').and.callFake(() => {return; });

    scale['scaledRectangleDimension'] = {width: 69, height: 69};
    scale['scaleOffset'] = new Point(0, 0);
    component.mouse.left.selectedElement = CircleType.TOP_CIRCLE;

    component.mouse.left.currentPoint = new Point(42, 42);

    const previousCurrentPoint = new Point(0, 0);

    const valueReturned = scale['onResize'](previousCurrentPoint);

    expect(valueReturned).toEqual({x: 0, y: 42});
    expect(scale['scaledRectangleDimension']).toEqual({width: 69, height: 27});
  });

  it('#onResize should return the right mouseOffset and set scaledRectagleDimension properly', () => {
    spyOn<any>(scale, 'resizeAll').and.callFake(() => {return; });

    scale['scaledRectangleDimension'] = {width: 69, height: 69};
    scale['scaleOffset'] = new Point(0, 0);
    component.mouse.left.selectedElement = CircleType.RIGHT_CIRCLE;

    component.mouse.left.currentPoint = new Point(42, 42);

    const previousCurrentPoint = new Point(0, 0);

    const valueReturned = scale['onResize'](previousCurrentPoint);

    expect(valueReturned).toEqual({x: 42, y: 0});
    expect(scale['scaledRectangleDimension']).toEqual({width: 111, height: 69});
  });

  it('#onResize should return the right mouseOffset and set scaledRectagleDimension properly', () => {
    spyOn<any>(scale, 'resizeAll').and.callFake(() => {return; });

    scale['scaledRectangleDimension'] = {width: 69, height: 69};
    scale['scaleOffset'] = new Point(0, 0);
    component.mouse.left.selectedElement = CircleType.BOTTOM_CIRCLE;

    component.mouse.left.currentPoint = new Point(42, 42);

    const previousCurrentPoint = new Point(0, 0);

    const valueReturned = scale['onResize'](previousCurrentPoint);

    expect(valueReturned).toEqual({x: 0, y: 42});
    expect(scale['scaledRectangleDimension']).toEqual({width: 69, height: 111});
  });

  it('#onResize should call resizeAll with the right factors', () => {
    const spy = spyOn<any>(scale, 'resizeAll').and.callFake(() => {return; });

    scale['scaledRectangleDimension'] = {width: 69, height: 69};
    scale['baseVisualisationRectangleDimension'] = {width: 69, height: 69};
    scale['scaleOffset'] = new Point(0, 0);
    component.mouse.left.selectedElement = CircleType.BOTTOM_CIRCLE;

    component.mouse.left.currentPoint = new Point(42, 42);

    const previousCurrentPoint = new Point(0, 0);

    scale['onResize'](previousCurrentPoint);

    expect(spy).toHaveBeenCalledWith([1, 111 / 69]);
  });

  it('#onResize should call resizeAll with the right factors', () => {
    const spy = spyOn<any>(scale, 'resizeAll').and.callFake(() => {return; });

    scale['scaledRectangleDimension'] = {width: 69, height: 69};
    scale['baseVisualisationRectangleDimension'] = {width: 69, height: 69};
    scale['scaleOffset'] = new Point(0, 0);
    component.mouse.left.selectedElement = CircleType.RIGHT_CIRCLE;

    component.mouse.left.currentPoint = new Point(42, 42);

    const previousCurrentPoint = new Point(0, 0);

    scale['onResize'](previousCurrentPoint);

    expect(spy).toHaveBeenCalledWith([111 / 69, 1]);
  });

  it('#resizeAll should call Transform.clone on every element in baseTransform', () => {
    const element = component.svgStructure.drawZone.children.item(0) as SVGElement;
    const transform = new Transform(element, component.renderer);

    scale['baseTransform'] = new Map<SVGElement, Transform>([[element, transform]]);
    scale['inverted'] = {x: 1, y: 1};
    scale['scaleOffset'] = {x: 42, y: 42};

    const spy = spyOn(transform, 'clone').and.callThrough();

    scale['resizeAll']([0.5, 0.5]);

    expect(spy).toHaveBeenCalled();
  });

  it('#resizeAll should call Transform.translateAll when factorX is not 1', () => {
    const element = component.svgStructure.drawZone.children.item(0) as SVGElement;
    const transform = new Transform(element, component.renderer);

    component.service.selectedElements.clear();
    component.service.selectedElements.add(element);
    scale['baseTransform'] = new Map<SVGElement, Transform>([[element, transform]]);
    scale['inverted'] = {x: 1, y: 1};
    scale['scaleOffset'] = {x: 42, y: 42};

    const spy = spyOn(Transform, 'translateAll');

    scale['resizeAll']([0.5, 1]);

    const expectedSet = new Set();
    expectedSet.add(element);

    expect(spy).toHaveBeenCalled();
  });

  it('#resizeAll should call Transform.translateAll when factorY is not 1', () => {
    const element = component.svgStructure.drawZone.children.item(0) as SVGElement;
    const transform = new Transform(element, component.renderer);

    component.service.selectedElements.clear();
    component.service.selectedElements.add(element);
    scale['baseTransform'] = new Map<SVGElement, Transform>([[element, transform]]);
    scale['inverted'] = {x: 1, y: 1};
    scale['scaleOffset'] = {x: 42, y: 42};

    const spy = spyOn(Transform, 'translateAll');

    scale['resizeAll']([1, 0.5]);

    const expectedSet = new Set();
    expectedSet.add(element);

    expect(spy).toHaveBeenCalled();
  });
});
