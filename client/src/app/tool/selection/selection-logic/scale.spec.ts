import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Point } from '../../shape/common/point';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { Offset } from '../offset';
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

  it('#onResize should return the right mouseOffset and set scaledRectagleDimension properly (left)', () => {
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

  it('#onResize should return the right mouseOffset and set scaledRectagleDimension properly (top)', () => {
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

  it('#onResize should return the right mouseOffset and set scaledRectagleDimension properly (right)', () => {
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

  it('#onResize should return the right mouseOffset and set scaledRectagleDimension properly (bottom)', () => {
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

  it('#resizeVisualisationRectangle should not call drawVisualisationResising', () => {
    const spy = spyOn<any>(scale, 'drawVisualisationResising');

    scale['resizeVisualisationRectangle']({x: 42, y: 0});

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('#resizeVisualisationRectangle should call drawVisualisationResising twice', () => {
    const spy = spyOn<any>(scale, 'drawVisualisationResising').and.callThrough();

    component.rectangles.visualisation.setAttribute('x', '42');
    component.rectangles.visualisation.setAttribute('y', '69');
    component.rectangles.visualisation.setAttribute('width', '69');
    component.rectangles.visualisation.setAttribute('height', '42');

    scale['resizeVisualisationRectangle']({x: 42, y: 0});

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('#resizeVisualisationRectangle should call preventResizeOverflow with the right parameters', () => {
    const spy = spyOn<any>(scale, 'preventResizeOverflow').and.callThrough();

    component.rectangles.visualisation.setAttribute('x', '42');
    component.rectangles.visualisation.setAttribute('y', '69');
    component.rectangles.visualisation.setAttribute('width', '69');
    component.rectangles.visualisation.setAttribute('height', '42');

    scale['resizeVisualisationRectangle']({x: 42, y: 0});

    const expectedMouseOffset: Offset = {x: 42, y: 0};
    const expectedPoint1 = new Point(42, 69);
    const expectedPoint2 = new Point(111, 111);

    expect(spy).toHaveBeenCalledWith(expectedMouseOffset, [expectedPoint1, expectedPoint2]);
  });

  it('#switchControlPoint should set inverted.x to -1 and set mouse.left.selectedElement to RIGHT_CIRCLE', () => {
    component.mouse.left.selectedElement = CircleType.LEFT_CIRCLE;
    scale['inverted'] = {x: 1, y: 1};

    const refPoint1 = new Point(42, 69);
    const refPoint2 = new Point(43, 42);
    const splittedOffset1 = {x: 4, y: 0};
    const splittedOffset2 = {x: 5, y: 0};

    scale['switchControlPoint']([refPoint1, refPoint2], [splittedOffset1, splittedOffset2]);

    const expectedElement = CircleType.RIGHT_CIRCLE;

    expect(scale['inverted']).toEqual({x: -1, y: 1});
    expect<any>(component.mouse.left.selectedElement).toEqual(expectedElement);
  });

  it('#switchControlPoint should not set inverted.x to -1 and not set mouse.left.selectedElement to RIGHT_CIRCLE', () => {
    component.mouse.left.selectedElement = CircleType.LEFT_CIRCLE;
    scale['inverted'] = {x: 1, y: 1};

    const refPoint1 = new Point(42, 69);
    const refPoint2 = new Point(43, 42);
    const splittedOffset1 = {x: -4, y: 0};
    const splittedOffset2 = {x: -5, y: 0};

    scale['switchControlPoint']([refPoint1, refPoint2], [splittedOffset1, splittedOffset2]);

    const expectedElement = CircleType.LEFT_CIRCLE;

    expect(scale['inverted']).toEqual({x: 1, y: 1});
    expect<any>(component.mouse.left.selectedElement).toEqual(expectedElement);
  });

  it('#switchControlPoint should set inverted.x to -1 and set mouse.left.selectedElement to LEFT_CIRCLE', () => {
    component.mouse.left.selectedElement = CircleType.RIGHT_CIRCLE;
    scale['inverted'] = {x: 1, y: 1};

    const refPoint1 = new Point(42, 69);
    const refPoint2 = new Point(43, 42);
    const splittedOffset1 = {x: -4, y: 0};
    const splittedOffset2 = {x: -5, y: 0};

    scale['switchControlPoint']([refPoint1, refPoint2], [splittedOffset1, splittedOffset2]);

    const expectedElement = CircleType.LEFT_CIRCLE;

    expect(scale['inverted']).toEqual({x: -1, y: 1});
    expect<any>(component.mouse.left.selectedElement).toEqual(expectedElement);
  });

  it('#switchControlPoint should not set inverted.x to -1 and not set mouse.left.selectedElement to LEFT_CIRCLE', () => {
    component.mouse.left.selectedElement = CircleType.RIGHT_CIRCLE;
    scale['inverted'] = {x: 1, y: 1};

    const refPoint1 = new Point(42, 69);
    const refPoint2 = new Point(43, 42);
    const splittedOffset1 = {x: 4, y: 0};
    const splittedOffset2 = {x: 5, y: 0};

    scale['switchControlPoint']([refPoint1, refPoint2], [splittedOffset1, splittedOffset2]);

    const expectedElement = CircleType.RIGHT_CIRCLE;

    expect(scale['inverted']).toEqual({x: 1, y: 1});
    expect<any>(component.mouse.left.selectedElement).toEqual(expectedElement);
  });



  it('#switchControlPoint should set inverted.y to -1 and set mouse.left.selectedElement to BOTTOM_CIRCLE', () => {
    component.mouse.left.selectedElement = CircleType.TOP_CIRCLE;
    scale['inverted'] = {x: 1, y: 1};

    const refPoint1 = new Point(42, 41);
    const refPoint2 = new Point(43, 42);
    const splittedOffset1 = {x: 0, y: 4};
    const splittedOffset2 = {x: 0, y: 5};

    scale['switchControlPoint']([refPoint1, refPoint2], [splittedOffset1, splittedOffset2]);

    const expectedElement = CircleType.BOTTOM_CIRCLE;

    expect(scale['inverted']).toEqual({x: 1, y: -1});
    expect<any>(component.mouse.left.selectedElement).toEqual(expectedElement);
  });

  it('#switchControlPoint should not set inverted.y to -1 and not set mouse.left.selectedElement to BOTTOM_CIRCLE', () => {
    component.mouse.left.selectedElement = CircleType.TOP_CIRCLE;
    scale['inverted'] = {x: 1, y: 1};

    const refPoint1 = new Point(42, 41);
    const refPoint2 = new Point(43, 42);
    const splittedOffset1 = {x: 0, y: -4};
    const splittedOffset2 = {x: 0, y: -5};

    scale['switchControlPoint']([refPoint1, refPoint2], [splittedOffset1, splittedOffset2]);

    const expectedElement = CircleType.TOP_CIRCLE;

    expect(scale['inverted']).toEqual({x: 1, y: 1});
    expect<any>(component.mouse.left.selectedElement).toEqual(expectedElement);
  });

  it('#switchControlPoint should set inverted.y to -1 and set mouse.left.selectedElement to TOP_CIRCLE', () => {
    component.mouse.left.selectedElement = CircleType.BOTTOM_CIRCLE;
    scale['inverted'] = {x: 1, y: 1};

    const refPoint1 = new Point(42, 41);
    const refPoint2 = new Point(43, 42);
    const splittedOffset1 = {x: 0, y: -4};
    const splittedOffset2 = {x: 0, y: -5};

    scale['switchControlPoint']([refPoint1, refPoint2], [splittedOffset1, splittedOffset2]);

    const expectedElement = CircleType.TOP_CIRCLE;

    expect(scale['inverted']).toEqual({x: 1, y: -1});
    expect<any>(component.mouse.left.selectedElement).toEqual(expectedElement);
  });

  it('#switchControlPoint should not set inverted.y to -1 and not set mouse.left.selectedElement to TOP_CIRCLE', () => {
    component.mouse.left.selectedElement = CircleType.BOTTOM_CIRCLE;
    scale['inverted'] = {x: 1, y: 1};

    const refPoint1 = new Point(42, 41);
    const refPoint2 = new Point(43, 42);
    const splittedOffset1 = {x: 0, y: 4};
    const splittedOffset2 = {x: 0, y: 5};

    scale['switchControlPoint']([refPoint1, refPoint2], [splittedOffset1, splittedOffset2]);

    const expectedElement = CircleType.BOTTOM_CIRCLE;

    expect(scale['inverted']).toEqual({x: 1, y: 1});
    expect<any>(component.mouse.left.selectedElement).toEqual(expectedElement);
  });

  it('#preventResizeOverflow should return theright offsets when LEFT_CIRCLE is selected', () => {
    component.mouse.left.selectedElement = CircleType.LEFT_CIRCLE;

    const mouseOffset = {x: 5, y: 0};
    const refPoint1 = new Point(42, 41);
    const refPoint2 = new Point(45, 42);

    const expectedReturn = scale['preventResizeOverflow'](mouseOffset, [refPoint1, refPoint2]);

    const expectedOffset0 = {x: 3, y: 0};
    const expectedOffset1 = {x: -2, y: 0};

    expect(expectedReturn).toEqual([expectedOffset0, expectedOffset1]);
  });

  it('#preventResizeOverflow should return theright offsets when LEFT_CIRCLE is selected', () => {
    component.mouse.left.selectedElement = CircleType.LEFT_CIRCLE;

    const mouseOffset = {x: 3, y: 0};
    const refPoint1 = new Point(42, 41);
    const refPoint2 = new Point(45, 42);

    const expectedReturn = scale['preventResizeOverflow'](mouseOffset, [refPoint1, refPoint2]);

    const expectedOffset0 = {x: 3, y: 0};
    const expectedOffset1 = {x: -0, y: 0};

    expect(expectedReturn).toEqual([expectedOffset0, expectedOffset1]);
  });


  it('#preventResizeOverflow should return theright offsets when TOP_CIRCLE is selected', () => {
    component.mouse.left.selectedElement = CircleType.TOP_CIRCLE;

    const mouseOffset = {x: 0, y: 5};
    const refPoint1 = new Point(42, 42);
    const refPoint2 = new Point(45, 45);

    const expectedReturn = scale['preventResizeOverflow'](mouseOffset, [refPoint1, refPoint2]);

    const expectedOffset0 = {x: 0, y: 3};
    const expectedOffset1 = {x: 0, y: -2};

    expect(expectedReturn).toEqual([expectedOffset0, expectedOffset1]);
  });

  it('#preventResizeOverflow should return the right offsets when TOP_CIRCLE is selected', () => {
    component.mouse.left.selectedElement = CircleType.TOP_CIRCLE;

    const mouseOffset = {x: 0, y: 3};
    const refPoint1 = new Point(42, 42);
    const refPoint2 = new Point(45, 45);

    const expectedReturn = scale['preventResizeOverflow'](mouseOffset, [refPoint1, refPoint2]);

    const expectedOffset0 = {x: 0, y: 3};
    const expectedOffset1 = {x: 0, y: -0};

    expect(expectedReturn).toEqual([expectedOffset0, expectedOffset1]);
  });


  it('#preventResizeOverflow should return theright offsets when BOTTOM_CIRCLE is selected', () => {
    component.mouse.left.selectedElement = CircleType.BOTTOM_CIRCLE;

    const mouseOffset = {x: 0, y: -5};
    const refPoint1 = new Point(42, 42);
    const refPoint2 = new Point(45, 45);

    const expectedReturn = scale['preventResizeOverflow'](mouseOffset, [refPoint1, refPoint2]);

    const expectedOffset0 = {x: 0, y: -3};
    const expectedOffset1 = {x: 0, y: 2};

    expect(expectedReturn).toEqual([expectedOffset0, expectedOffset1]);
  });

  it('#preventResizeOverflow should return the right offsets when BOTTOM_CIRCLE is selected', () => {
    component.mouse.left.selectedElement = CircleType.BOTTOM_CIRCLE;

    const mouseOffset = {x: 0, y: -3};
    const refPoint1 = new Point(42, 42);
    const refPoint2 = new Point(45, 45);

    const expectedReturn = scale['preventResizeOverflow'](mouseOffset, [refPoint1, refPoint2]);

    const expectedOffset0 = {x: 0, y: -3};
    const expectedOffset1 = {x: 0, y: -0};

    expect(expectedReturn).toEqual([expectedOffset0, expectedOffset1]);
  });


  it('#preventResizeOverflow should return theright offsets when RIGHT_CIRCLE is selected', () => {
    component.mouse.left.selectedElement = CircleType.RIGHT_CIRCLE;

    const mouseOffset = {x: -5, y: 0};
    const refPoint1 = new Point(42, 42);
    const refPoint2 = new Point(45, 45);

    const expectedReturn = scale['preventResizeOverflow'](mouseOffset, [refPoint1, refPoint2]);

    const expectedOffset0 = {x: -3, y: 0};
    const expectedOffset1 = {x: 2, y: 0};

    expect(expectedReturn).toEqual([expectedOffset0, expectedOffset1]);
  });

  it('#preventResizeOverflow should return the right offsets when RIGHT_CIRCLE is selected', () => {
    component.mouse.left.selectedElement = CircleType.RIGHT_CIRCLE;

    const mouseOffset = {x: -3, y: 0};
    const refPoint1 = new Point(42, 42);
    const refPoint2 = new Point(45, 45);

    const expectedReturn = scale['preventResizeOverflow'](mouseOffset, [refPoint1, refPoint2]);

    const expectedOffset0 = {x: -3, y: 0};
    const expectedOffset1 = {x: -0, y: 0};

    expect(expectedReturn).toEqual([expectedOffset0, expectedOffset1]);
  });

  it('#drawVisualisationResising should return the right points when LEFT_CIRCLE is selected', () => {
    component.mouse.left.selectedElement = CircleType.LEFT_CIRCLE;

    const mouseOffset = {x: -3, y: 0};
    const refPoint1 = new Point(42, 42);
    const refPoint2 = new Point(45, 45);

    const retrunedPoints = scale['drawVisualisationResising'](mouseOffset, [refPoint1, refPoint2]);

    const expectedReturnedPoint1 = new Point(39, 42);
    const expectedReturnedPoint2 = new Point(45, 45);

    expect(retrunedPoints).toEqual([expectedReturnedPoint1, expectedReturnedPoint2]);
  });

  it('#drawVisualisationResising should return the right points when TOP_CIRCLE is selected', () => {
    component.mouse.left.selectedElement = CircleType.TOP_CIRCLE;

    const mouseOffset = {x: 0, y: -3};
    const refPoint1 = new Point(42, 42);
    const refPoint2 = new Point(45, 45);

    const retrunedPoints = scale['drawVisualisationResising'](mouseOffset, [refPoint1, refPoint2]);

    const expectedReturnedPoint1 = new Point(42, 39);
    const expectedReturnedPoint2 = new Point(45, 45);

    expect(retrunedPoints).toEqual([expectedReturnedPoint1, expectedReturnedPoint2]);
  });

  it('#drawVisualisationResising should return the right points when RIGHT_CIRCLE is selected', () => {
    component.mouse.left.selectedElement = CircleType.RIGHT_CIRCLE;

    const mouseOffset = {x: 3, y: 0};
    const refPoint1 = new Point(42, 42);
    const refPoint2 = new Point(45, 45);

    const retrunedPoints = scale['drawVisualisationResising'](mouseOffset, [refPoint1, refPoint2]);

    const expectedReturnedPoint1 = new Point(42, 42);
    const expectedReturnedPoint2 = new Point(48, 45);

    expect(retrunedPoints).toEqual([expectedReturnedPoint1, expectedReturnedPoint2]);
  });

  it('#drawVisualisationResising should return the right points when BOTTOM_CIRCLE is selected', () => {
    component.mouse.left.selectedElement = CircleType.BOTTOM_CIRCLE;

    const mouseOffset = {x: 0, y: 3};
    const refPoint1 = new Point(42, 42);
    const refPoint2 = new Point(45, 45);

    const retrunedPoints = scale['drawVisualisationResising'](mouseOffset, [refPoint1, refPoint2]);

    const expectedReturnedPoint1 = new Point(42, 42);
    const expectedReturnedPoint2 = new Point(45, 48);

    expect(retrunedPoints).toEqual([expectedReturnedPoint1, expectedReturnedPoint2]);
  });
// tslint:disable-next-line: max-file-line-count
});
