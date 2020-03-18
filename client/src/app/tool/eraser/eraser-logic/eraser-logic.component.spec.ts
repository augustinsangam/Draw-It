import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import * as Util from '../../selection/selection-logic/selection-logic-util';
import { Point } from '../../shape/common/point';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';
import { CONSTANTS, EraserLogicComponent } from './eraser-logic.component';

// tslint:disable: no-string-literal no-any no-magic-numbers
describe('EraserLogicComponent', () => {
  let component: EraserLogicComponent;
  let fixture: ComponentFixture<EraserLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EraserLogicComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EraserLogicComponent);
    component = fixture.componentInstance;

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

    (TestBed.get(UndoRedoService) as UndoRedoService)
      .intialise(component.svgStructure);

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
    component.svgStructure.drawZone.appendChild(rec1);
    component.svgStructure.drawZone.appendChild(rec2);

    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#undo post action works well', () => {
    const spy = spyOn<any>(component, 'markElementsInZone');
    component['lastestMousePosition'] = new Point(0, 0);
    component['undoRedoService'].undo();
    expect(spy).toHaveBeenCalled();
  });

  it('#mouse down handler should do nothing'
    + ' the clicked button is not the left button', () => {
      const fakeEvent = {
        button: 1,
        offsetX: 200,
        offsetY: 200
      } as unknown as MouseEvent;

      const mouseDownHandler = (component['handlers'].get('mousedown')) as
        Util.MouseEventCallBack;

      mouseDownHandler(fakeEvent);
      expect(component['mouse'].startPoint).not.toEqual(new Point(200, 200));
      expect(component['mouse'].mouseIsDown).not.toEqual(true);
    });

  it('#mouse down handler should shange starting point'
    + ' and set mouseIsDown', () => {
      const fakeEvent = {
        button: 0,
        offsetX: 200,
        offsetY: 200
      } as unknown as MouseEvent;

      const mouseDownHandler = (component['handlers'].get('mousedown')) as
        Util.MouseEventCallBack;

      mouseDownHandler(fakeEvent);
      expect(component['mouse'].startPoint).toEqual(new Point(200, 200));
      expect(component['mouse'].mouseIsDown).toEqual(true);
    });

  it('#The eraser must be drawn when mouse move', () => {
    const fakeEvent = {
      button: 0,
      offsetX: 200,
      offsetY: 200
    } as unknown as MouseEvent;

    const spy = spyOn<any>(component, 'drawEraser').and.callThrough();
    const mouseDownHandler = (component['handlers'].get('mousemove')) as
      Util.MouseEventCallBack;

    mouseDownHandler(fakeEvent);
    expect(component['mouse'].currentPoint).toEqual(new Point(200, 200));
    expect(spy).toHaveBeenCalled();
  });

  it('#The eraser must be deleteElemts when mouse is on drag', () => {
    const fakeEvent = {
      button: 0,
      offsetX: 2,
      offsetY: 3
    } as unknown as MouseEvent;

    component['mouse'].mouseIsDown = true;
    const spy = spyOn<any>(component, 'deleteAll').and.callThrough();
    const mouseDownHandler = (component['handlers'].get('mousemove')) as
      Util.MouseEventCallBack;

    mouseDownHandler(fakeEvent);
    expect(component['mouse'].currentPoint).toEqual(new Point(2, 3));
    expect(spy).toHaveBeenCalled();
  });

  it('#elementsDeletedInDrag should be set when elements'
    + 'element(s) have been deleted during the drag', () => {
      const fakeEvent = {
        button: 0,
        offsetX: 2,
        offsetY: 3,
        x: 2,
        y: 3
      } as unknown as MouseEvent;

      component['mouse'].mouseIsDown = true;
      spyOn<any>(component, 'markElementsInZone').and.callFake(() => {
        return new Set([
          component.svgStructure.drawZone.children.item(0)
        ]);
      });
      const mouseDownHandler = (component['handlers'].get('mousemove')) as
        Util.MouseEventCallBack;

      mouseDownHandler(fakeEvent);
      expect(component['elementsDeletedInDrag']).toEqual(true);
    });

  it('#mouse up handler should do nothing'
    + ' the released button is not the left button', () => {
      const fakeEvent = {
        button: 1,
        offsetX: 200,
        offsetY: 200
      } as unknown as MouseEvent;

      const mouseUpHandler = (component['handlers'].get('mouseup')) as
        Util.MouseEventCallBack;

      mouseUpHandler(fakeEvent);
      expect(component['mouse'].endPoint).not.toEqual(new Point(200, 200));
      expect(component['mouse'].mouseIsDown).not.toEqual(true);
    });

  it('#mouse up handler should shange end point'
    + ' and reset mouseIsDown', () => {
      const fakeEvent = {
        button: 0,
        offsetX: 200,
        offsetY: 200
      } as unknown as MouseEvent;

      const mouseUpHandler = (component['handlers'].get('mouseup')) as
        Util.MouseEventCallBack;

      mouseUpHandler(fakeEvent);
      expect(component['mouse'].endPoint).toEqual(new Point(200, 200));
      expect(component['mouse'].mouseIsDown).toEqual(false);
    });

  it('#mouse up handler should save the draw state'
    + ' if elements had been deleted during the drag', () => {
      const fakeEvent = {
        button: 0,
        offsetX: 200,
        offsetY: 200
      } as unknown as MouseEvent;

      const spy = spyOn(component['undoRedoService'], 'saveState');
      component['elementsDeletedInDrag'] = true;
      const mouseUpHandler = (component['handlers'].get('mouseup')) as
        Util.MouseEventCallBack;

      mouseUpHandler(fakeEvent);
      expect(spy).toHaveBeenCalled();
    });

  it('#mouse should be hide when the cursor leave the '
    + 'drawing zone', () => {
      const spy = spyOn<any>(component, 'hideEraser').and.callThrough();
      const mouseLeaveHandler = (component['handlers'].get('mouseleave')) as
        () => void;
      mouseLeaveHandler();
      expect(spy).toHaveBeenCalled();
    });

  it('#The draw state should be saved when mouse leave the draw area '
    + 'and element had been deleted', () => {
      const spy = spyOn(component['undoRedoService'], 'saveState');
      component['elementsDeletedInDrag'] = true;
      const mouseLeaveHandler = (component['handlers'].get('mouseleave')) as
        () => void;
      mouseLeaveHandler();
      expect(spy).toHaveBeenCalled();
    });

  it('#Click handler works only '
    + 'if the left button had been clicked', () => {
      const fakeEvent = {
        button: 1,
        offsetX: 200,
        offsetY: 200
      } as unknown as MouseEvent;

      const mouseDownHandler = (component['handlers'].get('click')) as
        Util.MouseEventCallBack;

      const spy = spyOn<any>(component, 'deleteAll');

      mouseDownHandler(fakeEvent);
      expect(spy).not.toHaveBeenCalled();
    });

  it('#Click handler works only for real clicks', () => {
    const fakeEvent = {
      button: 0,
      offsetX: 200,
      offsetY: 200
    } as unknown as MouseEvent;

    component['mouse'].startPoint = new Point(0, 0);
    component['mouse'].startPoint = new Point(0, 1);

    const mouseDownHandler = (component['handlers'].get('click')) as
      Util.MouseEventCallBack;

    const spy = spyOn<any>(component, 'deleteAll');

    mouseDownHandler(fakeEvent);
    expect(spy).not.toHaveBeenCalled();
  });

  it('#Click handler can delete elements', () => {
    const fakeEvent = {
      button: 0,
      offsetX: 200,
      offsetY: 200
    } as unknown as MouseEvent;

    component['mouse'].startPoint = new Point(0, 0);
    component['mouse'].startPoint = new Point(0, 0);

    const mouseDownHandler = (component['handlers'].get('click')) as
      Util.MouseEventCallBack;

    spyOn<any>(component, 'markElementsInZone').and.callFake(() => {
      return new Set<SVGGElement>([
        component.svgStructure.drawZone.children.item(0) as SVGGElement,
        undefined as unknown as SVGGElement
      ]);
    });

    const spy = spyOn<any>(component, 'deleteAll');

    mouseDownHandler(fakeEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('#Click handler delete elements only if there is some', () => {
    const fakeEvent = {
      button: 0,
      offsetX: 200,
      offsetY: 200
    } as unknown as MouseEvent;

    component['mouse'].startPoint = new Point(0, 0);
    component['mouse'].startPoint = new Point(0, 0);

    const mouseDownHandler = (component['handlers'].get('click')) as
      Util.MouseEventCallBack;

    spyOn<any>(component, 'markElementsInZone').and.callFake(() => {
      return new Set([]);
    });

    const spy = spyOn<any>(component, 'deleteAll');

    mouseDownHandler(fakeEvent);
    expect(spy).not.toHaveBeenCalled();
  });

  it('#markElementsInZone change stroke color!', () => {
    const element = component.svgStructure.drawZone.children.item(0) as SVGElement;
    element.setAttribute('stroke', '#FFFFFF');
    spyOn(document, 'elementFromPoint').and.callFake(() => {
      return component.svgStructure.drawZone.children.item(0);
    });
    const markedElements = component['markElementsInZone'](0, 0);
    expect(markedElements).toContain(element);
    expect(element.getAttribute('stroke')).toEqual(CONSTANTS.RED);
  });

  it('#markElementsInZone handle well native red elements!', () => {
    const element = component.svgStructure.drawZone.children.item(0) as SVGElement;
    element.setAttribute('stroke', 'rgba(255, 0, 0, 1)');
    spyOn(document, 'elementFromPoint').and.callFake(() => {
      return component.svgStructure.drawZone.children.item(0);
    });
    const markedElements = component['markElementsInZone'](0, 0);
    expect(markedElements).toContain(element);
    expect(element.getAttribute('stroke'))
    .toEqual(`rgba(${255 - CONSTANTS.FACTOR}, 0, 0, 1)`);
  });

  it('#markElementsInZone should use fill for non-stroke draw elements!', () => {
    const element = component.svgStructure.drawZone.children.item(0) as SVGElement;
    element.setAttribute('stroke', 'none');
    element.setAttribute('fill', 'rgba(255, 255, 255, 1)');
    spyOn(document, 'elementFromPoint').and.callFake(() => {
      return component.svgStructure.drawZone.children.item(0);
    });
    const markedElements = component['markElementsInZone'](0, 0);
    expect(markedElements).toContain(element);
    expect(element.getAttribute('fill'))
    .toEqual('rgba(255, 0, 0, 1)');
  });

  it('#markElementsInZone should not do anything when there is no'
      + 'draw in the zone', () => {
    const element = undefined as unknown as SVGElement;
    spyOn(document, 'elementFromPoint').and.callFake(() => {
      return element;
    });
    const markedElements = component['markElementsInZone'](0, 0);
    expect(markedElements).not.toContain(element);
    expect(markedElements.size).toEqual(0);
  });

  it('#restoreMarkedElements put back the original stroke color!', () => {
    const element = component.svgStructure.drawZone.children.item(0) as SVGElement;
    element.setAttribute('stroke', '#FFFFFF');
    spyOn(document, 'elementFromPoint').and.callFake(() => {
      return component.svgStructure.drawZone.children.item(0);
    });
    component['markElementsInZone'](0, 0);
    component['restoreMarkedElements']();
    expect(element.getAttribute('stroke')).toEqual('#FFFFFF');
  });

  it('#restoreMarkedElements put back the original fill color!', () => {
    const element = component.svgStructure.drawZone.children.item(0) as SVGElement;
    element.setAttribute('fill', '#FFFFFF');
    element.setAttribute('stroke', 'none');
    spyOn(document, 'elementFromPoint').and.callFake(() => {
      return component.svgStructure.drawZone.children.item(0);
    });
    component['markElementsInZone'](0, 0);
    component['restoreMarkedElements']();
    expect(element.getAttribute('fill')).toEqual('#FFFFFF');
  });

});
// tslint:disable-next-line: max-file-line-count
