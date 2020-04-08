import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Renderer2 } from '@angular/core';
import { Point } from '../../tool/shape/common/point';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { MultipleSelection } from '../multiple-selection';
import { Offset } from '../offset';
import * as Util from './selection-logic-util';
import { SelectionLogicComponent } from './selection-logic.component';

// tslint:disable: no-magic-numbers no-string-literal no-any
describe('SelectionLogicComponent', () => {
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

    component.svgStructure.root.setAttribute('width', '500');
    component.svgStructure.root.setAttribute('height', '500');

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
    expect(component).toBeTruthy();
  });

  it('#left mouse down handler should do nothing'
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

  it('#right mouse down handler should do nothing'
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

  it('#left mouse down handler should at least modifiy left'
   + ' starting point and set mouseIsDown', () => {
    const fakeEvent = {
      button: 0,
      offsetX: 200,
      offsetY: 200,
      target: component['svgStructure'].root
    } as unknown as MouseEvent;

    const mouseDownHandler = (component['mouseHandlers'].get('leftButton') as
      Map<string, Util.MouseEventCallBack>).get('mousedown') as
        Util.MouseEventCallBack;

    mouseDownHandler(fakeEvent);
    expect(component['mouse'].left.startPoint).toEqual(new Point(200, 200));
    expect(component['mouse'].left.mouseIsDown).toEqual(true);
  });

  it('#left down handler should apply single selection when '
      + 'target is a draw and the click is real', () => {
    const fakeEvent = {
      button: 0,
      offsetX: 200,
      offsetY: 200,
      target: component.svgStructure.drawZone.children.item(0)
    } as unknown as MouseEvent;

    const mouseClickHandler = (component['mouseHandlers'].get('leftButton') as
      Map<string, Util.MouseEventCallBack>).get('mousedown') as
      Util.MouseEventCallBack;

    const spy = spyOn<any>(component, 'applySingleSelection').and.callThrough();

    mouseClickHandler(fakeEvent);

    expect(spy).toHaveBeenCalled();
  });

  it('#left mouse move handler should at least modifiy left'
   + ' current point when mouse in down', () => {
    const fakeEvent = {
      offsetX: 200,
      offsetY: 200,
      preventDefault: () => { return ; }
    } as unknown as MouseEvent;
    const mouseMoveHandler = (component['mouseHandlers'].get('leftButton') as
    Map<string, Util.MouseEventCallBack>).get('mousemove') as
    Util.MouseEventCallBack;

    component['mouse'].left.mouseIsDown = true;
    mouseMoveHandler(fakeEvent);
    expect(component['mouse'].left.currentPoint).toEqual(new Point(200, 200));
  });

  it('#left mouse move handler should do nothing when mouse is up', () => {
    const fakeEvent = {
      offsetX: 200,
      offsetY: 200,
      preventDefault: () => { return ; }
    } as unknown as MouseEvent;
    const mouseMoveHandler = (component['mouseHandlers'].get('leftButton') as
    Map<string, Util.MouseEventCallBack>).get('mousemove') as
    Util.MouseEventCallBack;
    component['mouse'].left.currentPoint = new Point(150, 150);
    mouseMoveHandler(fakeEvent);
    expect(component['mouse'].left.currentPoint).toEqual(new Point(150, 150));
  });

  it('#left mouse up handler should at least modifiy left'
   + ' end point and reset mouseIsDown', () => {
    const fakeEvent = {
      button: 0,
      offsetX: 200,
      offsetY: 200,
    } as unknown as MouseEvent;

    const mouseUpHandler = (component['mouseHandlers'].get('leftButton') as
      Map<string, Util.MouseEventCallBack>).get('mouseup') as
        Util.MouseEventCallBack;

    mouseUpHandler(fakeEvent);
    expect(component['mouse'].left.endPoint).toEqual(new Point(200, 200));
    expect(component['mouse'].left.mouseIsDown).toEqual(false);
  });

  it('#left mouse up handler should do nothing'
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

  it('#right mouse down handler should at least modifiy right'
   + ' starting point and set mouseIsDown', () => {
    const fakeEvent = {
      button: 2,
      offsetX: 200,
      offsetY: 200,
      target: component['svgStructure'].drawZone.children.item(0)
    } as unknown as MouseEvent;

    const mouseDownHandler = (component['mouseHandlers'].get('rightButton') as
      Map<string, Util.MouseEventCallBack>).get('mousedown') as
        Util.MouseEventCallBack;

    mouseDownHandler(fakeEvent);
    expect(component['mouse'].right.startPoint).toEqual(new Point(200, 200));
    expect(component['mouse'].right.mouseIsDown).toEqual(true);
  });

  it('#right mouse move handler should at least modifiy right'
   + ' current point when mouse in down', () => {
    const fakeEvent = {
      offsetX: 200,
      offsetY: 200
    } as unknown as MouseEvent;
    const mouseMoveHandler = (component['mouseHandlers'].get('rightButton') as
    Map<string, Util.MouseEventCallBack>).get('mousemove') as
    Util.MouseEventCallBack;
    component['selectedElementsFreezed'] = new Set();
    component['mouse'].right.mouseIsDown = true;
    mouseMoveHandler(fakeEvent);
    expect(component['mouse'].right.currentPoint).toEqual(new Point(200, 200));
  });

  it('#right mouse move handler should do nothing when mouse is up', () => {
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

  it('#right mouse up handler should at least modifiy right'
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

  it('#contextmenu handler should at least prevent default action', () => {
    const fakeEvent = {
      target: component['svgStructure'].root,
      preventDefault: () => {return ; },
    } as unknown as MouseEvent;

    const spy = spyOn(fakeEvent, 'preventDefault');
    spyOn<any>(component, 'applySingleInversion');

    const contextMenuHandler = (component['mouseHandlers'].get('rightButton') as
      Map<string, Util.MouseEventCallBack>).get('contextmenu') as
        Util.MouseEventCallBack;

    contextMenuHandler(fakeEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('#contextmenu handler should at apply a single inversion when target'
      + 'is a draw element', () => {
    const fakeEvent = {
      preventDefault: () => { return ; },
      target: component.svgStructure.drawZone.children.item(0)
    } as unknown as MouseEvent;

    const spy = spyOn<any>(component, 'applySingleInversion').and.callThrough();
    spyOn<any>(component, 'applyInversion');

    const contextMenuHandler = (component['mouseHandlers'].get('rightButton') as
      Map<string, Util.MouseEventCallBack>).get('contextmenu') as
        Util.MouseEventCallBack;

    contextMenuHandler(fakeEvent);

    expect(spy).toHaveBeenCalled();
  });

  it('#left mouse move handler should translate all shapes'
      + ' when draging', () => {
    const fakeEvent = {
      offsetX: 200,
      offsetY: 200,
      preventDefault: () => { return ; }
    } as unknown as MouseEvent;

    spyOn(component['deplacement'], 'onCursorMove');
    component['service'].magnetActive = false;
    const mouseMoveHandler = (component['mouseHandlers'].get('leftButton') as
      Map<string, Util.MouseEventCallBack>).get('mousemove') as
      Util.MouseEventCallBack;

    const spy = spyOn<any>(component, 'translateAll').and.callThrough();

    component['mouse'].left.onDrag = true;
    component['mouse'].left.mouseIsDown = true;
    mouseMoveHandler(fakeEvent);
    expect(spy).toHaveBeenCalled();

  });

  it('#left mouse move handler should drawSelection'
      + 'when not draging', () => {
    const fakeEvent = {
      offsetX: 200,
      offsetY: 200,
      preventDefault: () => { return ; }
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

  it('#left mouse up should save the draw state draging is over', () => {
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

  it('#left click handler should deleteVisualisation when'
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

  it('#left click handler should do nothing'
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

  it('#left click handler should do nothing'
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

  it('#left click handler should do nothing when'
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

  it('#right mouse up handler should do nothing '
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

  it('#overrided function in undo redo service function works well', () => {
    const spy = spyOn<any>(component, 'deleteVisualisation');
    component['undoRedoService'].undo();
    expect(spy).toHaveBeenCalled();
  });

  it('#A multiple selection is perfomed when user use Ctrl + A', () => {
    const spy = spyOn<any>(component, 'applyMultipleSelection');
    component['service'].selectAllElements.next();
    expect(spy).toHaveBeenCalled();
  });

  it('#applyInversion invert selection !', () => {
    const allElements = new Set<SVGElement>(
      Array.from(component['svgStructure'].drawZone.children) as SVGElement[]
    );
    const selectedElement =
      component['svgStructure'].drawZone.children.item(0) as SVGElement;
    component['selectedElementsFreezed'] = new Set([selectedElement]);
    component['applyInversion'](
      allElements, new Point(0, 0), new Point(1000, 1000));

    expect(component['service'].selectedElements).not.toContain(selectedElement);
  });

  it('#MultipleSelection.getSelection should return a null Zone'
   + ' when no element is selected', () => {
    expect(new MultipleSelection(new Set(), undefined as unknown as Offset)
    .getSelection().points).toEqual([new Point(0, 0), new Point(0, 0)]);
  });

  it('#A simple click on en element should select it', () => {
    const fakeEvent = {
      button: 0,
      target: component.svgStructure.drawZone.children.item(0)
    } as unknown as MouseEvent;

    const mouseClickHandler = (component['mouseHandlers'].get('leftButton') as
      Map<string, Util.MouseEventCallBack>).get('click') as
      Util.MouseEventCallBack;

    const spy = spyOn<any>(component, 'applySingleSelection');

    component['mouse'].left.startPoint = new Point(2, 3);
    component['mouse'].left.endPoint = new Point(2, 3);

    mouseClickHandler(fakeEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('#applyMultipleSelection should draw any visualisation if there is no'
    + 'elements in the inversion zone', () => {
      const undefinedPoint = undefined as unknown as Point;
      component['svgStructure'].drawZone = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg:g'
      ) as SVGGElement;
      const spy = spyOn<any>(component, 'drawVisualisation');
      component['applyMultipleSelection'](undefinedPoint, undefinedPoint);
      expect(spy).not.toHaveBeenCalled();
  });

});
// tslint:disable-next-line: max-file-line-count
