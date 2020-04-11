import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Point } from 'src/app/tool/shape/common/point';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { Deplacement } from './deplacement';
import { SelectionLogicComponent } from './selection-logic.component';

// tslint:disable: no-magic-numbers no-string-literal no-any
describe('Deplacement', () => {
  let component: SelectionLogicComponent;
  let fixture: ComponentFixture<SelectionLogicComponent>;
  let instance: Deplacement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionLogicComponent ],
      providers: [
        Renderer2
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionLogicComponent);
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

    component['svgShape'] = {
      width : 500,
      height: 500,
      color: 'rgba(255, 255, 255, 1)'
    };

    (TestBed.get(UndoRedoService) as UndoRedoService)
    .intialise(component.svgStructure);

    instance = new Deplacement(component);

    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(instance).toBeTruthy();
  });

  it('#KeyManager should contain all keypressed', () => {
    let fakeKeyDownEvent = {
      key: 'ArrowUp',
      preventDefault: () => { return ; }
    } as unknown as KeyboardEvent;
    instance.keyManager.handlers.keydown(fakeKeyDownEvent);
    expect(instance.keyManager.keyPressed).toContain('ArrowUp');
    fakeKeyDownEvent = {
      key: 'ArrowDown',
      preventDefault: () => { return ; }
    } as unknown as KeyboardEvent;
    instance.keyManager.handlers.keydown(fakeKeyDownEvent);
    expect(instance.keyManager.keyPressed).toContain('ArrowUp');
    expect(instance.keyManager.keyPressed).toContain('ArrowDown');
  });

  it('#KeyDown manager should consider only arrows', () => {
    const fakeKeyDownEvent = {
      key: 'ArrowUppppp',
      preventDefault: () => { return ; }
    } as unknown as KeyboardEvent;
    const spy = spyOn(fakeKeyDownEvent, 'preventDefault');
    instance.keyManager.handlers.keydown(fakeKeyDownEvent);
    expect(spy).not.toHaveBeenCalled();
  });

  it('#Translate should be done only after each 100 ms', fakeAsync(() => {
    const spy = spyOn<any>(instance, 'handleKey').and.callThrough();
    const fakeKeyDownEvent = {
      key: 'ArrowUp',
      preventDefault: () => { return ; }
    } as unknown as KeyboardEvent;
    component.service.magnetActive = false;
    instance.keyManager.handlers.keydown(fakeKeyDownEvent);
    expect(spy).not.toHaveBeenCalled();
    setTimeout(() => {
      instance.keyManager.handlers.keydown(fakeKeyDownEvent);
    }, 200);
    tick(200);
    expect(spy).toHaveBeenCalled();
    instance.keyManager.handlers.keydown(fakeKeyDownEvent);
  }));

  it('#KeyUp handler should save the state only'
       + ' all arrows are released', fakeAsync(() => {
    const spy = spyOn(component['undoRedoService'], 'saveState');
    const arrowUpEvent = {
      key: 'ArrowUp',
      preventDefault: () => { return ; }
    } as unknown as KeyboardEvent;
    const arrowDownEvent = {
      key: 'ArrowDown',
      preventDefault: () => { return ; }
    } as unknown as KeyboardEvent;
    instance.keyManager.handlers.keydown(arrowUpEvent);
    instance.keyManager.handlers.keydown(arrowDownEvent);
    instance.keyManager.handlers.keyup(arrowUpEvent);
    expect(spy).not.toHaveBeenCalled();
    instance.keyManager.handlers.keyup(arrowDownEvent);
    expect(spy).toHaveBeenCalled();
  }));

  it('#Arrows should translate the object to the nearest intersection '
      + 'when magnet tool is active', () => {
    component.service.magnetActive = true;
    component.service.magnetPoint = 0;
    component.gridService.squareSize = 10;

    instance.keyManager.keyPressed.add('ArrowUp');

    const testCases: [Point, Point][] = [
      [new Point(9, 9)    ,   new Point(10, 0)],
      [new Point(10, 10)  ,   new Point(10, 0)],
      [new Point(10, 0)   ,   new Point(10, 0)],
      [new Point(0, 0)    ,   new Point(0, 0)],
      [new Point(19, 19)  ,   new Point(20, 10)],
    ];

    document.body.appendChild(component.svgStructure.root);

    testCases.forEach((testCase) => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
      rect.setAttribute('x', testCase[0].x.toString());
      rect.setAttribute('y', testCase[0].y.toString());
      rect.setAttribute('width', '100');
      rect.setAttribute('height', '100');
      rect.setAttribute('transform', '');
      component.svgStructure.drawZone.appendChild(rect);
      component.service.selectedElements = new Set([rect]);
      instance['handleKey']('ArrowUp', 0, -3);
      const boundingRect = rect.getBoundingClientRect();
      const boundingRectSVG = component.svgStructure.root.getBoundingClientRect();
      expect(boundingRect.left - boundingRectSVG.left).toEqual(testCase[1].x);
      expect(boundingRect.top  - boundingRectSVG.top) .toEqual(testCase[1].y);
      rect.remove();
    });

    document.body.removeChild(component.svgStructure.root);
  });

  it('#draws should go to the nearest intersection when going down', () => {
    component.service.magnetActive = true;
    component.service.magnetPoint = 0;
    component.gridService.squareSize = 10;
    instance.keyManager.keyPressed.add('ArrowDown');
    document.body.appendChild(component.svgStructure.root);
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rect.setAttribute('x', '19');
    rect.setAttribute('y', '19');
    rect.setAttribute('width', '100');
    rect.setAttribute('height', '100');
    rect.setAttribute('transform', '');
    component.svgStructure.drawZone.appendChild(rect);
    component.service.selectedElements = new Set([rect]);
    instance['handleKey']('ArrowDown', 0, 3);
    const boundingRect = rect.getBoundingClientRect();
    const boundingRectSVG = component.svgStructure.root.getBoundingClientRect();
    expect(boundingRect.left - boundingRectSVG.left).toEqual(20);
    expect(boundingRect.top  - boundingRectSVG.top) .toEqual(20);
    rect.remove();
    document.body.removeChild(component.svgStructure.root);
  });

  it('#draws should go to the nearest intersection when going up', () => {
    component.service.magnetActive = true;
    component.service.magnetPoint = 0;
    component.gridService.squareSize = 10;
    instance.keyManager.keyPressed.add('ArrowUp');
    document.body.appendChild(component.svgStructure.root);
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rect.setAttribute('x', '21');
    rect.setAttribute('y', '21');
    rect.setAttribute('width', '100');
    rect.setAttribute('height', '100');
    rect.setAttribute('transform', '');
    component.svgStructure.drawZone.appendChild(rect);
    component.service.selectedElements = new Set([rect]);
    instance['handleKey']('ArrowUp', 0, -3);
    const boundingRect = rect.getBoundingClientRect();
    const boundingRectSVG = component.svgStructure.root.getBoundingClientRect();
    expect(boundingRect.left - boundingRectSVG.left).toEqual(20);
    expect(boundingRect.top  - boundingRectSVG.top) .toEqual(20);
    rect.remove();
    document.body.removeChild(component.svgStructure.root);
  });

  it('#draws should go to the nearest intersection when going left', () => {
    component.service.magnetActive = true;
    component.service.magnetPoint = 0;
    component.gridService.squareSize = 10;
    instance.keyManager.keyPressed.add('ArrowLeft');
    document.body.appendChild(component.svgStructure.root);
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rect.setAttribute('x', '21');
    rect.setAttribute('y', '21');
    rect.setAttribute('width', '100');
    rect.setAttribute('height', '100');
    rect.setAttribute('transform', '');
    component.svgStructure.drawZone.appendChild(rect);
    component.service.selectedElements = new Set([rect]);
    instance['handleKey']('ArrowLeft', -3, 0);
    const boundingRect = rect.getBoundingClientRect();
    const boundingRectSVG = component.svgStructure.root.getBoundingClientRect();
    expect(boundingRect.left - boundingRectSVG.left).toEqual(20);
    expect(boundingRect.top  - boundingRectSVG.top) .toEqual(20);
    rect.remove();
    document.body.removeChild(component.svgStructure.root);
  });

  it('#draws should go to the nearest intersection when going right', () => {
    component.service.magnetActive = true;
    component.service.magnetPoint = 0;
    component.gridService.squareSize = 10;
    instance.keyManager.keyPressed.add('ArrowRight');
    document.body.appendChild(component.svgStructure.root);
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rect.setAttribute('x', '19');
    rect.setAttribute('y', '19');
    rect.setAttribute('width', '100');
    rect.setAttribute('height', '100');
    rect.setAttribute('transform', '');
    component.svgStructure.drawZone.appendChild(rect);
    component.service.selectedElements = new Set([rect]);
    instance['handleKey']('ArrowRight', 3, 0);
    const boundingRect = rect.getBoundingClientRect();
    const boundingRectSVG = component.svgStructure.root.getBoundingClientRect();
    expect(boundingRect.left - boundingRectSVG.left).toEqual(20);
    expect(boundingRect.top  - boundingRectSVG.top) .toEqual(20);
    rect.remove();
    document.body.removeChild(component.svgStructure.root);
  });

  it('#onMouseDown should set the offset', () => {
    component.service.magnetPoint = 0;

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rect.setAttribute('x', '10');
    rect.setAttribute('y', '10');
    rect.setAttribute('width', '100');
    rect.setAttribute('height', '100');
    rect.setAttribute('transform', '');
    component.svgStructure.drawZone.appendChild(rect);
    document.body.appendChild(component.svgStructure.root);
    component.service.selectedElements = new Set([rect]);

    component.mouse.left.currentPoint = new Point(20, 20);

    instance.onMouseDown();

    expect(instance.offset).toEqual({x: -10, y: -10});
  });

  it('#onCursorMove should translate the object to the nearest intersection '
      + 'when magnet tool is active', () => {
    component.service.magnetActive = true;
    component.service.magnetPoint = 0;
    component.gridService.squareSize = 10;

    component.mouse.left.currentPoint = new Point(20, 20);
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rect.setAttribute('x', '10');
    rect.setAttribute('y', '10');
    rect.setAttribute('width', '100');
    rect.setAttribute('height', '100');
    rect.setAttribute('transform', '');
    component.svgStructure.drawZone.appendChild(rect);
    document.body.appendChild(component.svgStructure.root);
    component.service.selectedElements = new Set([rect]);
    instance.onMouseDown();
  
    const testCases: [Point, Point][] = [
      [new Point(10, 10)    ,   new Point(0, 0)],
      // [new Point(10, 10)  ,   new Point(10, 10)],
      // [new Point(10, 0)   ,   new Point(10, 0)],
      // [new Point(0, 0)    ,   new Point(0, 0)],
      // [new Point(19, 19)  ,   new Point(20, 20)],
    ];


    testCases.forEach((testCase) => {
      component.mouse.left.currentPoint = testCase[0];
      instance.onCursorMove();
      const boundingRect = rect.getBoundingClientRect();
      const boundingRectSVG = component.svgStructure.root.getBoundingClientRect();
      expect(boundingRect.left - boundingRectSVG.left).toEqual(testCase[1].x);
      expect(boundingRect.top  - boundingRectSVG.top) .toEqual(testCase[1].y);
    });

    rect.remove();
    document.body.removeChild(component.svgStructure.root);
  });

});
