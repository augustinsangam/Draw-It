import { Renderer2 } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { UndoRedoService } from 'src/app/tool/undo-redo/undo-redo.service';
import { ColorService } from '../../../color/color.service';
import { ToolLogicDirective } from '../../../tool-logic/tool-logic.directive';
import {Point} from '../../common/point';
import { PolygoneService } from '../polygone.service';
import { PolygoneLogicComponent } from './polygone-logic.component';

const createClickMouseEvent = (event: string): MouseEvent => {
    return new MouseEvent(event, {
      offsetX: 10,
      offsetY: 30,
      button: 0
    } as MouseEventInit);
  };
// tslint:disable:no-string-literal no-any no-magic-numbers max-file-line-count
describe('PolygoneLogicComponent', () => {
  let component: PolygoneLogicComponent;
  let fixture: ComponentFixture<PolygoneLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PolygoneLogicComponent, ToolLogicDirective],
      providers: [Renderer2, ColorService, PolygoneService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolygoneLogicComponent);
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

    fixture.detectChanges();
  });

  it('#should created', () => {
    expect(component).toBeTruthy();
  });

  it('#mousedown should call the initRectangle function', fakeAsync(() => {
    const spy1 = spyOn<any>(component, 'initRectangle').and.callThrough();
    component.svgStructure.root.dispatchEvent(
      createClickMouseEvent('mousedown')
    );
    setTimeout(() => {
      expect(spy1).toHaveBeenCalledTimes(1);
    }, 500);
    tick(500);
  }));

  it('#the ngOnInit initialise the arrow of listeners', () => {
    component.ngOnInit();
    expect(component['allListeners'].length).toEqual(3);
  });

  it('#mouseup event should call the onMouseUp function', () => {
    const spy1 = spyOn<any>(component, 'onMouseUp');
    document.dispatchEvent(
      createClickMouseEvent('mouseup')
    );
    expect(spy1).toHaveBeenCalled();
  });

  it('#initPolygone should initialise all the atributes ', () => {
    expect(component['polygones']).toEqual([]);
    expect(component['onDrag']).toBeFalsy();
    component['service'].fillOption = false;
    const event = createClickMouseEvent('mousedown');
    component['initPolygone'](event);
    const pointExpected = new Point(event.offsetX, event.offsetY);
    expect(component['mouseDownPoint']).toEqual(pointExpected);
    expect(component['polygones'].length).toEqual(1);
    expect(component['onDrag']).toBeTruthy();
    expect(component['style']).toBeTruthy();
  });

  it('#the attributes are not initialised when the wrong button is clicked',
    () => {
      component.ngOnInit();
      expect(component['polygones']).toEqual([]);
      expect(component['onDrag']).toBeFalsy();
      const event = new MouseEvent('mousedown', {
        offsetX: 10,
        offsetY: 30,
        button: 1 // right click.
      } as MouseEventInit);
      component['service'].borderOption = false;
      component['initPolygone'](event);
      const pointExpected = new Point(event.offsetX, event.offsetY);
      expect(component['mouseDownPoint']).not.toEqual(pointExpected);
      expect(component['polygones'].length).not.toEqual(1);
      expect(component['onDrag']).not.toBeTruthy();
  });

  it('#the polygone css is only defined by the polygoneService'
    + 'and the colorService', () => {
      const event = createClickMouseEvent('mousedown');
      component['initPolygone'](event);
      const spy = spyOn<any>(component['getPolygone'](), 'setParameters');
      component['service'].borderOption = false;
      component['service'].fillOption = true;
      component['colorService'].secondaryColor = 'black';
      component['colorService'].primaryColor = 'black';
      const style = {
        borderWidth: '0',
        borderColor: 'red',
        fillColor: 'red',
        filled: true
      };
      component['initPolygone'](event);
      expect(spy).not.toHaveBeenCalledWith(style);
    });

  it('#initRectangle should not do anything if called with a non left click', () => {
    const spy = spyOn(component['renderer'], 'appendChild');
    component['initRectangle'](new MouseEvent('mousedown',  {button: 2}));
    expect(spy).not.toHaveBeenCalled();
  });

  it('#mouseMove should call the drawPolygoneFromRectangle function', fakeAsync(() => {
    component.ngOnInit();
    component['initPolygone'](createClickMouseEvent('mousedown'));
    component['initRectangle'](createClickMouseEvent('mousedown'));
    component.svgStructure.root.dispatchEvent(
        createClickMouseEvent('mousedown')
        );
    const spy1 = spyOn<any>( component['getPolygone'](), 'drawPolygonFromRectangle').and.callThrough();
    component.svgStructure.root.dispatchEvent(
      createClickMouseEvent('mousemove')
    );
    setTimeout(() => {
      expect(spy1).toHaveBeenCalled();
    }, 500);
    tick(500);
  }));

  it('#mouseMove should not do anything if not on drag', fakeAsync(() => {
    component.ngOnInit();
    component['initPolygone'](createClickMouseEvent('mousedown'));
    const spy1 = spyOn<any>( component['getPolygone'](), 'drawPolygonFromRectangle').and.callThrough();
    component.svgStructure.root.dispatchEvent(
    createClickMouseEvent('mousedown')
    );
    component['onDrag'] = false;
    component.svgStructure.root.dispatchEvent(
      createClickMouseEvent('mousemove')
    );
    setTimeout(() => {
      expect(spy1).not.toHaveBeenCalled();
    }, 500);
    tick(500);
  }));

  it('#mouseUp should call saveState and ' +
  'setCSS', () => {
    const spy1 = spyOn(component['undoRedoService'], 'saveState');
    component['initPolygone'](createClickMouseEvent('mousedown'));
    component['initRectangle'](createClickMouseEvent('mousedown'));
    const spy2 = spyOn<any>(component['getPolygone'](), 'setCss').and.callThrough();
    component['onMouseUp'](createClickMouseEvent('mouseup'));
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('#mouseUp should not do anything if its not on drag', () => {
  component['initPolygone'](createClickMouseEvent('mousedown'));
  const spy1 = spyOn<any>(component['undoRedoService'], 'saveState');
  spyOn<any>(component, 'getPolygone').and.callThrough();
  component['onDrag'] = false;
  component['onMouseUp'](new MouseEvent('mousedown', {button: 2}));
  expect(spy1).not.toHaveBeenCalled();
  });

  it('#ngOnDestroy should set "called" to true ' +
  '(= call every listener´s functions)',
  () => {
      let called = false;
      component['allListeners'] = [() => (called = true)];
      component.ngOnDestroy();
      expect(called).toBeTruthy();
  }
  );

  it('#the override function should call undoBase and onMouseUp if onDrag', () => {
    const spyMouseUp = spyOn<any>(component, 'onMouseUp');
    const spyUndoBase = spyOn(component['undoRedoService'], 'undoBase');
    component['initPolygone'](createClickMouseEvent('mousedown'));
    component['onDrag'] = true;
    (component['undoRedoService']['actions'].undo[0].overrideFunction as () => void)();
    expect(spyMouseUp).toHaveBeenCalled();
    expect(spyUndoBase).toHaveBeenCalled();
  });

  it('#the override function should call undoBase but not onMouseUp if not onDrag', () => {
    const spyMouseUp = spyOn<any>(component, 'onMouseUp');
    const spyUndoBase = spyOn(component['undoRedoService'], 'undoBase');
    component['initPolygone'](createClickMouseEvent('mousedown'));
    component['onDrag'] = false;
    (component['undoRedoService']['actions'].undo[0].overrideFunction as () => void)();
    expect(spyMouseUp).not.toHaveBeenCalled();
    expect(spyUndoBase).toHaveBeenCalled();
    });
});
