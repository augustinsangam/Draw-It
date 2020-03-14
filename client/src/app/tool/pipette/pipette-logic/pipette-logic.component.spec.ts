import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {SvgToCanvasService} from '../../../svg-to-canvas/svg-to-canvas.service';
import {SvgService} from '../../../svg/svg.service';
import { PipetteLogicComponent } from './pipette-logic.component';

const createClickMouseEvent = (event: string, button: number): MouseEvent => {
  return new MouseEvent(event, {
    offsetX: 10,
    offsetY: 30,
    button
  } as MouseEventInit);
};

// tslint:disable:no-magic-numbers no-string-literal no-any
describe('PipetteLogicComponent', () => {
  let component: PipetteLogicComponent;
  let fixture: ComponentFixture<PipetteLogicComponent>;
  let svgService: SvgService;
  let svgToCanvas: SvgToCanvasService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipetteLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipetteLogicComponent);
    component = fixture.componentInstance;
    svgToCanvas = TestBed.get(SvgToCanvasService);
    svgService = svgToCanvas['svgService'];

    const testSvgStructure = {
      root: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      defsZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      drawZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      temporaryZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      endZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement
    };
    testSvgStructure.root.appendChild(testSvgStructure.defsZone);
    testSvgStructure.root.appendChild(testSvgStructure.drawZone);
    testSvgStructure.root.appendChild(testSvgStructure.temporaryZone);
    testSvgStructure.root.appendChild(testSvgStructure.endZone);

    svgService.structure = testSvgStructure;
    component.svgStructure = testSvgStructure;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onMouseClick should set the colorService primary color  ' +
    'if called with a left click', () => {
    const expected = 'rgba(42,42,42,1)';
    component['service'].currentColor = expected;
    component['onMouseClick'](createClickMouseEvent('mouseclick', 0));
    expect(component['colorService'].primaryColor).toEqual(expected);
  });

  it('onMouseClick should set the colorService secondaryCommand when called' +
    ' with a right click', () => {
    const expected = 'rgba(42,42,42,1)';
    component['service'].currentColor = expected;
    component['onMouseClick'](createClickMouseEvent('mouseclick', 2));
    expect(component['colorService'].secondaryColor).toEqual(expected);
  });

  it('onMouseClick should not do anything when called with ' +
    'an unknown click', () => {
    const spy1 = spyOn(component['colorService'], 'selectPrimaryColor');
    const spy2 = spyOn(component['colorService'], 'selectSecondaryColor');
    component['onMouseClick'](createClickMouseEvent('mouseclick', 1));
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('onMouseMove should call ngOnInit whent the background color has changed', () => {
    component['colorService'].backgroundColor = 'rgba(0,0,0,1)';
    const spy = spyOn(component, 'ngOnInit');
    component['onMouseMove'](createClickMouseEvent('mousemove', 0));
    expect(spy).toHaveBeenCalled();
  });

  it('onMouseMove should read the pixel data whether it is a right or left click', () => {
    const spy = spyOn(component['image'], 'getImageData').and.callFake(() => {
      return {data: [1, 1, 1, 1]} as unknown as ImageData;
    });
    component['service'].currentColor = 'rgba(124,124,124,1)';
    component['onMouseMove'](createClickMouseEvent('mousemove', 2));
    expect(spy).toHaveBeenCalled();
  });

  it('ngOnDestroy should call the listeners and call resetActions of undoRedoService', () => {
    let called = false;
    const spy = spyOn(component['undoRedoService'], 'resetActions');
    component['allListeners'] = [() => called = true];
    component.ngOnDestroy();
    expect(called).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('ngOnInit should initialize the listeners properly', () => {
    component['allListeners'] = [];
    component.ngOnInit();
    expect(component['allListeners'].length).toEqual(3);
  });

  it('the listeners should handle mouseclick', () => {
    const expectedMouseEv = createClickMouseEvent('click', 2);
    const spy = spyOn<any>(component, 'onMouseClick');
    component.ngOnInit();
    component.svgStructure.root.dispatchEvent(expectedMouseEv);
    expect(spy).toHaveBeenCalled();
  });

  it('the listeners should handle mousemove', () => {
    const expectedMouseEv = createClickMouseEvent('mousemove', 2);
    const spy = spyOn<any>(component, 'onMouseMove');
    component.ngOnInit();
    component.svgStructure.root.dispatchEvent(expectedMouseEv);
    expect(spy).toHaveBeenCalled();
  });

  it('the listeners should handle mousemove', () => {
    const expectedMouseEv = createClickMouseEvent('contextmenu', 2);
    const spy = spyOn<any>(component, 'onMouseClick');
    component.ngOnInit();
    component.svgStructure.root.dispatchEvent(expectedMouseEv);
    expect(spy).toHaveBeenCalled();
  });

  it('the post undo override function should call ngOnInit', () => {
    const spy = spyOn(component, 'ngOnInit');
    (component['undoRedoService']['actions'].undo[1].function as () => void)();
    expect(spy).toHaveBeenCalled();
  });

  it('the post redo override function should call ngOnInit', () => {
    const spy = spyOn(component, 'ngOnInit');
    (component['undoRedoService']['actions'].redo[1].function as () => void)();
    expect(spy).toHaveBeenCalled();
  });

  it('onMouseMove should not call getImageData if the image is null', () => {
    const spy = spyOn(component['image'], 'getImageData');
    component['image'] = null as unknown as CanvasRenderingContext2D;
    component['onMouseMove'](createClickMouseEvent('mousemove', 2));
    expect(spy).not.toHaveBeenCalled();
  });

});
