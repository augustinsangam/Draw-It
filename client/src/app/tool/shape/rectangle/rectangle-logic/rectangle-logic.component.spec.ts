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
import { RectangleService } from '../rectangle.service';
import { RectangleLogicComponent } from './rectangle-logic.component';

const createClickMouseEvent = (event: string): MouseEvent => {
  return new MouseEvent(event, {
    offsetX: 10,
    offsetY: 30,
    button: 0
  } as MouseEventInit);
};

// tslint:disable:no-string-literal no-any no-magic-numbers
fdescribe('RectangleLogicComponent', () => {
  let component: RectangleLogicComponent;
  let fixture: ComponentFixture<RectangleLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RectangleLogicComponent, ToolLogicDirective],
      providers: [Renderer2, ColorService, RectangleService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleLogicComponent);
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

  it('#should create', () => {
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

  it('#initRectangle should initialise all the atributes ', () => {
    expect(component['rectangles']).toEqual([]);
    expect(component['onDrag']).toBeFalsy();
    const event = createClickMouseEvent('mousedown');
    component['initRectangle'](event);
    const pointExpected = new Point(event.offsetX, event.offsetY);
    expect(component['currentPoint']).toEqual(pointExpected);
    expect(component['rectangles'].length).toEqual(1);
    expect(component['onDrag']).toBeTruthy();
    expect(component['style']).toBeTruthy();
    expect(component['mouseDownPoint']).toEqual(pointExpected);
  });

  it('#the atributes are not initialised when the wrong button is clicked',
    () => {
      expect(component['rectangles']).toEqual([]);
      expect(component['onDrag']).toBeFalsy();
      const event = new MouseEvent('mousedown', {
        offsetX: 10,
        offsetY: 30,
        button: 1 // right click.
      } as MouseEventInit);
      component['service'].borderOption = false;
      component['initRectangle'](event);
      const pointExpected = new Point(event.offsetX, event.offsetY);
      expect(component['currentPoint']).not.toEqual(pointExpected);
      expect(component['mouseDownPoint']).not.toEqual(pointExpected);
      expect(component['rectangles'].length).not.toEqual(1);
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

  it('#the listeners should handle key ups', () => {
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


  it('#the rectangle css is only defined by the rectangleService'
    + 'and the colorService', () => {
      const event = createClickMouseEvent('mousedown');
      component['initRectangle'](event);
      const spy = spyOn<any>(component['getRectangle'](), 'setParameters');
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
      component['initRectangle'](event);
      expect(spy).not.toHaveBeenCalledWith(style);
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

  it('#viewTemporaryForm should call the function dragRectangle'
    + 'on mouseMove', fakeAsync(() => {
      component['initRectangle'](createClickMouseEvent('mousedown'));
      component.svgStructure.root.dispatchEvent(
        createClickMouseEvent('mousedown')
      );
      const spy = spyOn<any>(
        component['getRectangle'](),
        'dragRectangle'
      ).and.callThrough();
      component.svgStructure.root.dispatchEvent(
        createClickMouseEvent('mousemove')
      );
      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
      }, 500);
      tick(500);
    }));

  it('#viewTemporaryForm should call the function dragSquare'
    + 'when shift is pressed ', fakeAsync(() => {
      component['initRectangle'](createClickMouseEvent('mousedown'));
      // On a explicitement besoin du any car la méthode est privée
      // tslint:disable-next-line: no-any
      const spy1 = spyOn<any>(component['getRectangle'](), 'dragSquare');
      const event: MouseEvent = new MouseEvent('mousemove', {
        offsetX: 10,
        offsetY: 30,
        button: 0,
        shiftKey: true
      } as MouseEventInit);
      component['viewTemporaryForm'](event);
      expect(spy1).toHaveBeenCalled();
    }));

  it('#a pressed shift should call dragSquare', () => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    const event = new KeyboardEvent('window:keydown', {
      code: 'ShiftRight',
      key: 'Shift'
    });
    const spy = spyOn<any>(
      component['getRectangle'](),
      'dragSquare'
    ).and.callThrough();
    component['onKeyDown'](event);
    expect(spy).toHaveBeenCalled();
  });

  it('#if it is not on onDrag, keyEvent should not call any function', () => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    const event1 = new KeyboardEvent('window:keydown', {
      code: 'ShiftRight',
      key: 'Shift'
    });
    component['onDrag'] = false;
    const spy1 = spyOn<any>(
      component['getRectangle'](),
      'dragSquare'
    ).and.callThrough();
    const spy2 = spyOn<any>(
      component['getRectangle'](),
      'dragRectangle'
    ).and.callThrough();
    component['onKeyDown'](event1);
    const event2 = new KeyboardEvent('window:keyup', {});
    component['onKeyUp'](event2);
    expect(spy1).toHaveBeenCalledTimes(0);
    expect(spy2).toHaveBeenCalledTimes(0);
  });

  it('#if it is not on ShiftKey, keyDown should not call any function', () => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    const event1 = new KeyboardEvent('window:keydown', { code: 'BackSpace' });
    const event2 = new KeyboardEvent('window:keyup', { code: 'BackSpace' });
    component['onDrag'] = true;
    const spy1 = spyOn<any>(
      component['getRectangle'](),
      'dragSquare'
    ).and.callThrough();
    component['onKeyDown'](event1);
    expect(spy1).not.toHaveBeenCalled();
    const spy2 = spyOn<any>(
      component['getRectangle'](),
      'dragRectangle'
    ).and.callThrough();
    component['onKeyUp'](event2);
    expect(spy2).not.toHaveBeenCalled();
  });

  it('#onKeyUp should call dragRectangle', () => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    const event = new KeyboardEvent('window:keyup', {
      code: 'ShiftRight',
      key: 'Shift'
    });
    const spy = spyOn<any>(
      component['getRectangle'](),
      'dragRectangle'
    ).and.callThrough();
    component['onKeyUp'](event);
    expect(spy).toHaveBeenCalled();
  });

  it('#mouseUp should call viewTemporaryForm and setOpacity', fakeAsync(() => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    const spy1 = spyOn<any>(component, 'viewTemporaryForm').and.callThrough();
    spyOn<any>(component, 'getRectangle').and.callThrough();
    const spy2 = spyOn<any>(
      component['getRectangle'](),
      'setCss'
    ).and.callThrough();
    document.dispatchEvent(
      new MouseEvent('mouseup', { button: 0 } as MouseEventInit)
    );
    setTimeout(() => {
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    }, 500);
    tick(500);
  }));

  it('#mouseUp should not do anything if its not on drag', fakeAsync(() => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    component['onDrag'] = false;
    const spy1 = spyOn<any>(component, 'viewTemporaryForm');
    spyOn<any>(component, 'getRectangle');
    document.dispatchEvent(
      new MouseEvent('mouseup', { button: 0 } as MouseEventInit)
    );
    setTimeout(() => {
      expect(spy1).not.toHaveBeenCalled();
    }, 500);
    tick(500);
  }));

  it('#if the fill atribute is off, the opacity is null', fakeAsync(() => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    spyOn<any>(component, 'getRectangle').and.callThrough();
    const spy1 = spyOn<any>(
      component['getRectangle'](),
      'setCss'
    ).and.callThrough();
    document.dispatchEvent(
      new MouseEvent('mouseup', { button: 0 } as MouseEventInit)
    );
    setTimeout(() => {
      expect(spy1).toHaveBeenCalled();
    }, 500);
    tick(500);
  }));

  it('#onKeyUp should call dragRectangle', () => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    const event = new KeyboardEvent('window:keyup', {
      code: 'ShiftRight',
      key: 'Shift'
    });
    const spy = spyOn<any>(
      component['getRectangle'](),
      'dragRectangle'
    ).and.callThrough();
    component['onKeyUp'](event);
    expect(spy).toHaveBeenCalled();
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
  it('#the override function should call undoBase if it is not onDrag', () => {
    const spyUndoBase = spyOn(component['undoRedoService'], 'undoBase');
    component['initRectangle'](createClickMouseEvent('mousedown'));
    component['onDrag'] = false;
    (component['undoRedoService']['actions'].undo[0].overrideFunction as () => void)();
    expect(spyUndoBase).toHaveBeenCalled();
  });

  it('#the override function should call undoBase and addNewLine if it is not a newPath', () => {
    const spyNewRectangle = spyOn<any>(component, 'onMouseUp');
    const spyUndoBase = spyOn(component['undoRedoService'], 'undoBase');
    component['initRectangle'](createClickMouseEvent('mousedown'));
    component['onDrag'] = true;
    (component['undoRedoService']['actions'].undo[0].overrideFunction as () => void)();
    expect(spyUndoBase).toHaveBeenCalled();
    expect(spyNewRectangle).toHaveBeenCalled();
  });
});
// tslint:disable-next-line: max-file-line-count
