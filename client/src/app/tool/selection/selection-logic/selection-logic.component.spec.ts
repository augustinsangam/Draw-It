import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Renderer2 } from '@angular/core';
import { Point } from '../../shape/common/point';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import * as Util from './selection-logic-util';
import { SelectionLogicComponent } from './selection-logic.component';

// TODO : Ask the chargé de lab
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: no-any
fdescribe('SelectionLogicComponent', () => {
  let component: SelectionLogicComponent;
  let fixture: ComponentFixture<SelectionLogicComponent>;

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
    const rec2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rec2.setAttribute('x', '22');
    rec2.setAttribute('y', '30');
    rec2.setAttribute('width', '100');
    rec2.setAttribute('height', '100');
    // const circle = document.createElementNS('http://www.w3.org/2000/svg', 'svg:circle');
    component.svgStructure.drawZone.appendChild(rec1);
    component.svgStructure.drawZone.appendChild(rec2);
    // component.svgStructure.temporaryZone.appendChild(circle);

    (TestBed.get(UndoRedoService) as UndoRedoService)
    .intialise(component.svgStructure);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('left mouse down handler should do nothing'
   + ' the clicked button is not the left button', () => {
    const fakeEvent = {
      button: 1,
      offsetX: 200,
      offsetY: 200
    } as unknown as MouseEvent;

    const mouseDownHandler = (component['mouseHandlers'].get('leftButton') as
      Map<string, Util.MouseEventCallBack>).get('mousedown') as
        Util.MouseEventCallBack;

    mouseDownHandler(fakeEvent);
    expect(component['mouse'].left.startPoint).not.toEqual(new Point(200, 200));
    expect(component['mouse'].left.mouseIsDown).not.toEqual(true);
  });

  it('right mouse down handler should do nothing'
   + ' the clicked button is not the right button', () => {
    const fakeEvent = {
      button: 1,
      offsetX: 200,
      offsetY: 200
    } as unknown as MouseEvent;

    const mouseDownHandler = (component['mouseHandlers'].get('rightButton') as
      Map<string, Util.MouseEventCallBack>).get('mousedown') as
        Util.MouseEventCallBack;

    mouseDownHandler(fakeEvent);
    expect(component['mouse'].right.startPoint).not.toEqual(new Point(200, 200));
    expect(component['mouse'].right.mouseIsDown).not.toEqual(true);
  });

  it('left mouse down handler should at least modifiy left'
   + ' starting point and set mouseIsDown', () => {
    const fakeEvent = {
      button: 0,
      offsetX: 200,
      offsetY: 200
    } as unknown as MouseEvent;

    const mouseDownHandler = (component['mouseHandlers'].get('leftButton') as
      Map<string, Util.MouseEventCallBack>).get('mousedown') as
        Util.MouseEventCallBack;

    mouseDownHandler(fakeEvent);
    expect(component['mouse'].left.startPoint).toEqual(new Point(200, 200));
    expect(component['mouse'].left.mouseIsDown).toEqual(true);
  });

  it('left mouse move handler should at least modifiy left'
   + ' current point when mouse in down', () => {
    const fakeEvent = {
      offsetX: 200,
      offsetY: 200
    } as unknown as MouseEvent;
    const mouseMoveHandler = (component['mouseHandlers'].get('leftButton') as
    Map<string, Util.MouseEventCallBack>).get('mousemove') as
    Util.MouseEventCallBack;

    component['mouse'].left.mouseIsDown = true;
    mouseMoveHandler(fakeEvent);
    expect(component['mouse'].left.currentPoint).toEqual(new Point(200, 200));
  });

  it('left mouse move handler should do nothing when mouse is up', () => {
    const fakeEvent = {
      offsetX: 200,
      offsetY: 200
    } as unknown as MouseEvent;
    const mouseMoveHandler = (component['mouseHandlers'].get('leftButton') as
    Map<string, Util.MouseEventCallBack>).get('mousemove') as
    Util.MouseEventCallBack;
    component['mouse'].left.currentPoint = new Point(150, 150);
    mouseMoveHandler(fakeEvent);
    expect(component['mouse'].left.currentPoint).toEqual(new Point(150, 150));
  });

  it('left mouse up handler should at least modifiy left'
   + ' end point and reset mouseIsDown', () => {
    const fakeEvent = {
      button: 0,
      offsetX: 200,
      offsetY: 200
    } as unknown as MouseEvent;

    const mouseUpHandler = (component['mouseHandlers'].get('leftButton') as
      Map<string, Util.MouseEventCallBack>).get('mouseup') as
        Util.MouseEventCallBack;

    mouseUpHandler(fakeEvent);
    expect(component['mouse'].left.endPoint).toEqual(new Point(200, 200));
    expect(component['mouse'].left.mouseIsDown).toEqual(false);
  });

  it('left mouse up handler should do nothing'
   + ' when the button released is not the left one', () => {
    const fakeEvent = {
      button: 1,
      offsetX: 200,
      offsetY: 200
    } as unknown as MouseEvent;

    const mouseUpHandler = (component['mouseHandlers'].get('leftButton') as
      Map<string, Util.MouseEventCallBack>).get('mouseup') as
        Util.MouseEventCallBack;

    mouseUpHandler(fakeEvent);
    expect(component['mouse'].left.endPoint).not.toEqual(new Point(200, 200));
  });

  it('right mouse down handler should at least modifiy right'
   + ' starting point and set mouseIsDown', () => {
    const fakeEvent = {
      button: 2,
      offsetX: 200,
      offsetY: 200
    } as unknown as MouseEvent;

    const mouseDownHandler = (component['mouseHandlers'].get('rightButton') as
      Map<string, Util.MouseEventCallBack>).get('mousedown') as
        Util.MouseEventCallBack;

    mouseDownHandler(fakeEvent);
    expect(component['mouse'].right.startPoint).toEqual(new Point(200, 200));
    expect(component['mouse'].right.mouseIsDown).toEqual(true);
  });

  it('right mouse move handler should at least modifiy right'
   + ' current point when mouse in down', () => {
    const fakeEvent = {
      offsetX: 200,
      offsetY: 200
    } as unknown as MouseEvent;
    const mouseMoveHandler = (component['mouseHandlers'].get('rightButton') as
    Map<string, Util.MouseEventCallBack>).get('mousemove') as
    Util.MouseEventCallBack;

    component['mouse'].right.mouseIsDown = true;
    mouseMoveHandler(fakeEvent);
    expect(component['mouse'].right.currentPoint).toEqual(new Point(200, 200));
  });

  it('right mouse move handler should do nothing when mouse is up', () => {
    const fakeEvent = {
      offsetX: 200,
      offsetY: 200
    } as unknown as MouseEvent;
    const mouseMoveHandler = (component['mouseHandlers'].get('rightButton') as
    Map<string, Util.MouseEventCallBack>).get('mousemove') as
    Util.MouseEventCallBack;
    component['mouse'].right.currentPoint = new Point(150, 150);
    mouseMoveHandler(fakeEvent);
    expect(component['mouse'].right.currentPoint).toEqual(new Point(150, 150));
  });

  it('right mouse up handler should at least modifiy right'
   + ' end point and reset mouseIsDown', () => {
    const fakeEvent = {
      button: 2,
      offsetX: 200,
      offsetY: 200
    } as unknown as MouseEvent;

    const mouseUpHandler = (component['mouseHandlers'].get('rightButton') as
      Map<string, Util.MouseEventCallBack>).get('mouseup') as
        Util.MouseEventCallBack;

    mouseUpHandler(fakeEvent);
    expect(component['mouse'].right.endPoint).toEqual(new Point(200, 200));
    expect(component['mouse'].right.mouseIsDown).toEqual(false);
  });

  it('contextmenu handler should at least prevent default action', () => {
    const fakeEvent = {
      preventDefault: () => { },
    } as unknown as MouseEvent;

    const spy = spyOn(fakeEvent, 'preventDefault');

    const contextMenuHandler = (component['mouseHandlers'].get('rightButton') as
      Map<string, Util.MouseEventCallBack>).get('contextmenu') as
        Util.MouseEventCallBack;

    contextMenuHandler(fakeEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('contextmenu handler should at apply a single inversion when target'
      + 'is a draw element', () => {
    const fakeEvent = {
      preventDefault: () => { },
      target: component.svgStructure.drawZone.children.item(0)
    } as unknown as MouseEvent;

    const spy = spyOn<any>(component, 'applySingleInversion');

    const contextMenuHandler = (component['mouseHandlers'].get('rightButton') as
      Map<string, Util.MouseEventCallBack>).get('contextmenu') as
        Util.MouseEventCallBack;

    contextMenuHandler(fakeEvent);

    expect(spy).toHaveBeenCalled();
  });

  it('left mouse move handler should translate all shapes'
      + 'when draging', () => {
    const fakeEvent = {
      offsetX: 200,
      offsetY: 200
    } as unknown as MouseEvent;

    const mouseMoveHandler = (component['mouseHandlers'].get('leftButton') as
      Map<string, Util.MouseEventCallBack>).get('mousemove') as
      Util.MouseEventCallBack;

    const spy = spyOn<any>(component, 'translateAll').and.callThrough();

    component['mouse'].left.onDrag = true;
    component['mouse'].left.mouseIsDown = true;
    mouseMoveHandler(fakeEvent);
    expect(spy).toHaveBeenCalled();

  });

  it('left mouse move handler should drawSelection'
      + 'when not draging', () => {
    const fakeEvent = {
      offsetX: 200,
      offsetY: 200
    } as unknown as MouseEvent;

    const mouseMoveHandler = (component['mouseHandlers'].get('leftButton') as
      Map<string, Util.MouseEventCallBack>).get('mousemove') as
      Util.MouseEventCallBack;

    const spy = spyOn<any>(component, 'applyMultipleSelection').and.callThrough();

    component['mouse'].left.onDrag = false;
    component['mouse'].left.mouseIsDown = true;
    mouseMoveHandler(fakeEvent);
    expect(spy).toHaveBeenCalled();

  });

  it('left mouse up should save the draw state draging is over', () => {
    const fakeEvent = {
      button: 0,
      offsetX: 200,
      offsetY: 200
    } as unknown as MouseEvent;

    const mouseMoveHandler = (component['mouseHandlers'].get('leftButton') as
      Map<string, Util.MouseEventCallBack>).get('mouseup') as
      Util.MouseEventCallBack;

    const spy = spyOn(component['undoRedoService'], 'saveState');

    component['mouse'].left.onDrag = true;
    component['mouse'].left.startPoint = new Point(0, 0);
    component['mouse'].left.currentPoint = new Point(1, 1);
    mouseMoveHandler(fakeEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('left click handler should apply single selection when'
      + 'target is a draw and the click is real', () => {
    const fakeEvent = {
      button: 0,
      target: component.svgStructure.drawZone.children.item(0)
    } as unknown as MouseEvent;

    const mouseClickHandler = (component['mouseHandlers'].get('leftButton') as
      Map<string, Util.MouseEventCallBack>).get('click') as
      Util.MouseEventCallBack;

    const spy = spyOn<any>(component, 'applySingleSelection').and.callThrough();

    component['mouse'].left.startPoint = new Point(2, 3);
    component['mouse'].left.endPoint = new Point(2, 3);

    mouseClickHandler(fakeEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('left click handler should deleteVisualisation when'
      + 'target is not a draw element and it is a real click', () => {
    const fakeEvent = {
      button: 0,
      target: component.svgStructure.root
    } as unknown as MouseEvent;

    const mouseClickHandler = (component['mouseHandlers'].get('leftButton') as
      Map<string, Util.MouseEventCallBack>).get('click') as
      Util.MouseEventCallBack;

    const spy = spyOn<any>(component, 'deleteVisualisation').and.callThrough();

    component['mouse'].left.startPoint = new Point(2, 3);
    component['mouse'].left.endPoint = new Point(2, 3);

    mouseClickHandler(fakeEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('left click handler should do nothing'
      + 'when the click is not real', () => {
    const fakeEvent = {
      button: 0,
      target: component.svgStructure.drawZone.children.item(0)
    } as unknown as MouseEvent;

    const mouseClickHandler = (component['mouseHandlers'].get('leftButton') as
      Map<string, Util.MouseEventCallBack>).get('click') as
      Util.MouseEventCallBack;

    const spySelection = spyOn<any>(component, 'applySingleSelection');
    const spyVisualisation = spyOn<any>(component, 'deleteVisualisation');

    component['mouse'].left.startPoint = new Point(2, 3);
    component['mouse'].left.endPoint = new Point(2, 4);

    mouseClickHandler(fakeEvent);
    expect(spySelection).not.toHaveBeenCalled();
    expect(spyVisualisation).not.toHaveBeenCalled();
  });

  it('left click handler should do nothing'
    + 'the click is not on the left button', () => {
      const fakeEvent = {
        button: 1,
        target: component.svgStructure.drawZone.children.item(0)
      } as unknown as MouseEvent;

      const mouseClickHandler = (component['mouseHandlers'].get('leftButton') as
        Map<string, Util.MouseEventCallBack>).get('click') as
        Util.MouseEventCallBack;

      const spySelection = spyOn<any>(component, 'applySingleSelection');
      const spyVisualisation = spyOn<any>(component, 'deleteVisualisation');

      component['mouse'].left.startPoint = new Point(2, 3);
      component['mouse'].left.endPoint = new Point(2, 4);

      mouseClickHandler(fakeEvent);
      expect(spySelection).not.toHaveBeenCalled();
      expect(spyVisualisation).not.toHaveBeenCalled();
  });

  it('left click handler should do nothing when'
    + 'target is a control point', () => {
      const fakeEvent = {
        button: 0,
        target: component['circles'][0]
      } as unknown as MouseEvent;

      const mouseClickHandler = (component['mouseHandlers'].get('leftButton') as
        Map<string, Util.MouseEventCallBack>).get('click') as
        Util.MouseEventCallBack;

      const spySelection = spyOn<any>(component, 'applySingleSelection');
      const spyVisualisation = spyOn<any>(component, 'deleteVisualisation');

      component['mouse'].left.startPoint = new Point(2, 3);
      component['mouse'].left.endPoint = new Point(2, 3);

      mouseClickHandler(fakeEvent);
      expect(spySelection).not.toHaveBeenCalled();
      expect(spyVisualisation).not.toHaveBeenCalled();
    });

  it('right mouse up handler should do nothing '
    + ' when the button released is not the right one', () => {
      const fakeEvent = {
        button: 0,
        offsetX: 200,
        offsetY: 200
      } as unknown as MouseEvent;

      const mouseUpHandler = (component['mouseHandlers'].get('rightButton') as
        Map<string, Util.MouseEventCallBack>).get('mouseup') as
        Util.MouseEventCallBack;

      mouseUpHandler(fakeEvent);
      expect(component['mouse'].right.endPoint).not.toEqual(new Point(200, 200));
    });


});
