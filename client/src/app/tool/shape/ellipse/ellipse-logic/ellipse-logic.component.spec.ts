import { Renderer2 } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { UndoRedoService } from 'src/app/undo-redo/undo-redo.service';
import { ColorService } from '../../../color/color.service';
import { ToolLogicDirective } from '../../../tool-logic/tool-logic.directive';
import { Point } from '../../common/point';
import { EllipseService } from '../ellipse.service';
import { EllipseLogicComponent } from './ellipse-logic.component';

const createClickMouseEvent = (event: string): MouseEvent => {
  return new MouseEvent(event, {
    offsetX: 10,
    offsetY: 30,
    button: 0
  } as MouseEventInit);
};

// tslint:disable:no-string-literal no-any no-magic-numbers max-file-line-count
describe('EllipseLogicComponent', () => {
  let component: EllipseLogicComponent;
  let fixture: ComponentFixture<EllipseLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EllipseLogicComponent, ToolLogicDirective],
      providers: [Renderer2, ColorService, EllipseService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EllipseLogicComponent);
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

  it('#mousedown should call the initEllipse function', fakeAsync(() => {
    const spy1 = spyOn<any>(component, 'initEllipse').and.callThrough();
    component.svgStructure.root.dispatchEvent(
      createClickMouseEvent('mousedown')
    );
    setTimeout(() => {
      expect(spy1).toHaveBeenCalledTimes(1);
    }, 500);
    tick(500);
  }));

  it('#mouseup event should call the onMouseUp function', () => {
    const spy1 = spyOn<any>(component, 'onMouseUp');
    document.dispatchEvent(
      createClickMouseEvent('mouseup')
    );
    expect(spy1).toHaveBeenCalled();
  });

  it('#initEllipse should initialise all the atributes ', () => {
    expect(component['ellipses']).toEqual([]);
    expect(component['onDrag']).toBeFalsy();
    component['service'].fillOption = false;
    const event = createClickMouseEvent('mousedown');
    component['initEllipse'](event);
    const pointExpected = new Point(event.offsetX, event.offsetY);
    expect(component['currentPoint']).toEqual(pointExpected);
    expect(component['initialPoint']).toEqual(pointExpected);
    expect(component['ellipses'].length).toEqual(1);
    expect(component['onDrag']).toBeTruthy();
    expect(component['style']).toBeTruthy();
  });

  it('#the attributes are not initialised when the wrong button is clicked',
    () => {
      expect(component['ellipses']).toEqual([]);
      expect(component['onDrag']).toBeFalsy();
      const event = new MouseEvent('mousedown', {
        offsetX: 10,
        offsetY: 30,
        button: 1
      } as MouseEventInit);
      component['service'].borderOption = false;
      component['initEllipse'](event);
      const pointExpected = new Point(event.offsetX, event.offsetY);
      expect(component['currentPoint']).not.toEqual(pointExpected);
      expect(component['initialPoint']).not.toEqual(pointExpected);
      expect(component['ellipses'].length).not.toEqual(1);
      expect(component['onDrag']).toBeFalsy();
    });

  it('#the listeners should handle key downs', () => {
    const globKeyEv = new KeyboardEvent('keydown');
    spyOn<any>(component, 'onKeyDown').and.callFake((keyEv: KeyboardEvent) =>
      expect(keyEv).toBe(globKeyEv)
    );
    component.ngOnInit();
    component.svgStructure.root.dispatchEvent(globKeyEv);
  });

  it('#the listenerss should handle key ups', () => {
    const globKeyEv = new KeyboardEvent('keyup');
    spyOn<any>(component, 'onKeyUp').and.callFake((keyEv: KeyboardEvent) =>
      expect(keyEv).toBe(globKeyEv)
    );
    component.ngOnInit();
    component.svgStructure.root.dispatchEvent(globKeyEv);
  });

  it('#the ngOnInit initialise the arrow of listeners', () => {
    component.ngOnInit();
    expect(component['allListeners'].length).toEqual(5);
  });

  it('#the ellipse css is only defined by the ellipseService'
    + 'and the colorService', () => {
      const event = createClickMouseEvent('mousedown');
      component['initEllipse'](event);
      const spy = spyOn<any>(component['getEllipse'](), 'setParameters');
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
      component['initEllipse'](event);
      expect(spy).not.toHaveBeenCalledWith(style);
    });

  it('#initRectangleVisu should not do anything if called with a non left click', () => {
    const spy = spyOn(component['renderer'], 'appendChild');
    component['initRectangleVisu'](new MouseEvent('mousedown',  {button: 2}));
    expect(spy).not.toHaveBeenCalled();
  });

  it('#mouseMove should call the viewTemporaryForm function', fakeAsync(() => {
    const spy1 = spyOn<any>(component, 'viewTemporaryForm').and.callThrough();
    component.svgStructure.root.dispatchEvent(
      createClickMouseEvent('mousedown')
    );
    component.svgStructure.root.dispatchEvent(
      createClickMouseEvent('mousemove')
    );
    setTimeout(() => {
      expect(spy1).toHaveBeenCalledTimes(1);
    }, 1000);
    tick(1000);
  }));

  it('#mouseMove should not do anything if not on drag', fakeAsync(() => {
    const spy1 = spyOn<any>(component, 'viewTemporaryForm').and.callThrough();
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

  it('#viewTemporaryForm should call the function simulateEllipse'
    + 'on mouseMove', fakeAsync(() => {
      component['initEllipse'](createClickMouseEvent('mousedown'));
      component.svgStructure.root.dispatchEvent(
        createClickMouseEvent('mousedown')
      );
      const spy = spyOn<any>(
        component['getEllipse'](),
        'simulateEllipse'
      ).and.callThrough();
      component.svgStructure.root.dispatchEvent(
        createClickMouseEvent('mousemove')
      );
      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
      }, 500);
      tick(500);
    }));

  it('#viewTemporaryForm should call the function simulateCircle'
    + 'when shift is pressed ', fakeAsync(() => {
      component['initEllipse'](createClickMouseEvent('mousedown'));
      const spy1 = spyOn<any>(component['getEllipse'](), 'simulateCircle');
      const event: MouseEvent = new MouseEvent('mousemove', {
        offsetX: 10,
        offsetY: 30,
        button: 0,
        shiftKey: true
      } as MouseEventInit);
      component['viewTemporaryForm'](event);
      expect(spy1).toHaveBeenCalled();
    }));

  it('#a pressed shift should call simulateCircle', () => {
    component['initEllipse'](createClickMouseEvent('mousedown'));
    const event = new KeyboardEvent('window:keydown', {
      code: 'ShiftRight',
      key: 'Shift'
    });
    const spy = spyOn<any>(
      component['getEllipse'](),
      'simulateCircle'
    ).and.callThrough();
    component['onKeyDown'](event);
    expect(spy).toHaveBeenCalled();
  });

  it('#if it is not on onDrag, keyEvent should not call any function', () => {
    component['initEllipse'](createClickMouseEvent('mousedown'));
    const event1 = new KeyboardEvent('window:keydown', {
      code: 'ShiftRight',
      key: 'Shift'
    });
    component['onDrag'] = false;
    const spy1 = spyOn<any>(
      component['getEllipse'](),
      'simulateCircle'
    ).and.callThrough();
    const spy2 = spyOn<any>(
      component['getEllipse'](),
      'simulateEllipse'
    ).and.callThrough();
    component['onKeyDown'](event1);
    const event2 = new KeyboardEvent('window:keyup', {});
    component['onKeyUp'](event2);
    expect(spy1).toHaveBeenCalledTimes(0);
    expect(spy2).toHaveBeenCalledTimes(0);
  });

  it('#if it is not on ShiftKey, keyDown should not call any function', () => {
    component['initEllipse'](createClickMouseEvent('mousedown'));
    const event1 = new KeyboardEvent('window:keydown', { code: 'BackSpace' });
    const event2 = new KeyboardEvent('window:keyup', { code: 'BackSpace' });
    component['onDrag'] = true;
    const spy1 = spyOn<any>(
      component['getEllipse'](),
      'simulateCircle'
    ).and.callThrough();
    component['onKeyDown'](event1);
    expect(spy1).not.toHaveBeenCalled();
    const spy2 = spyOn<any>(
      component['getEllipse'](),
      'simulateEllipse'
    ).and.callThrough();
    component['onKeyUp'](event2);
    expect(spy2).not.toHaveBeenCalled();
  });

  it('#onKeyUp should call simulateEllipse', () => {
    component['initEllipse'](createClickMouseEvent('mousedown'));
    const event = new KeyboardEvent('window:keyup', {
      code: 'ShiftRight',
      key: 'Shift'
    });
    const spy = spyOn<any>(
      component['getEllipse'](),
      'simulateEllipse'
    ).and.callThrough();
    component['onKeyUp'](event);
    expect(spy).toHaveBeenCalled();
  });

  it('#mouseUp should call saveState and ' +
    'set style opacity', () => {
      const spy1 = spyOn(component['undoRedoService'], 'saveState');
      component['initEllipse'](createClickMouseEvent('mousedown'));
      // spyOn<any>(component, 'initEllipse').and.callThrough();
      component['onMouseUp'](createClickMouseEvent('mouseup'));
      expect(spy1).toHaveBeenCalled();
      expect(component['style'].opacity).toEqual('1');
    });

  it('#mouseUp should not do anything if its not on drag', () => {
    component['initEllipse'](createClickMouseEvent('mousedown'));
    const spy1 = spyOn<any>(component['undoRedoService'], 'saveState');
    spyOn<any>(component, 'getEllipse').and.callThrough();
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
    component['initEllipse'](createClickMouseEvent('mousedown'));
    component['onDrag'] = true;
    (component['undoRedoService']['actions'].undo[0].overrideFunction as () => void)();
    expect(spyMouseUp).toHaveBeenCalled();
    expect(spyUndoBase).toHaveBeenCalled();
  });

  it('#the override function should call undoBase but not onMouseUp if not onDrag', () => {
    const spyMouseUp = spyOn<any>(component, 'onMouseUp');
    const spyUndoBase = spyOn(component['undoRedoService'], 'undoBase');
    component['initEllipse'](createClickMouseEvent('mousedown'));
    component['onDrag'] = false;
    (component['undoRedoService']['actions'].undo[0].overrideFunction as () => void)();
    expect(spyMouseUp).not.toHaveBeenCalled();
    expect(spyUndoBase).toHaveBeenCalled();
  });

});
