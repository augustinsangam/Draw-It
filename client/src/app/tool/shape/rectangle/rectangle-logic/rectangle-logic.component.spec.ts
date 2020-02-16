import { ElementRef, Renderer2 } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { ColorService } from '../../../color/color.service';
import { ToolLogicDirective } from '../../../tool-logic/tool-logic.directive';
import { Point } from '../../common/Point';
import { RectangleService } from '../rectangle.service';
import { RectangleLogicComponent } from './rectangle-logic.component';

const createClickMouseEvent = (event: string): MouseEvent => {
  return new MouseEvent(event, {
    offsetX: 10,
    offsetY: 30,
    button: 0
  } as MouseEventInit);
};
// tslint:disable:no-string-literal
describe('RectangleLogicComponent', () => {
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
    component.svgElRef = new ElementRef<SVGElement>(
      document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('mousedown should call the initRectangle function', fakeAsync(() => {
    const spy1 = spyOn<any>(component, 'initRectangle').and.callThrough();
    component.svgElRef.nativeElement.dispatchEvent(
      createClickMouseEvent('mousedown')
    );
    setTimeout(() => {
      expect(spy1).toHaveBeenCalledTimes(1);
    }, 500);
    tick(500);
  }));

  it('initRectangle should initialise all the atributes ', () => {
    expect(component['rectangles']).toEqual([]);
    expect(component['currentRectangleIndex']).toEqual(-1);
    expect(component['onDrag']).toBeFalsy();
    const event = createClickMouseEvent('mousedown');
    component['initRectangle'](event);
    const pointExpected: Point = { x: event.offsetX, y: event.offsetY };
    expect(component['currentPoint']).toEqual(pointExpected);
    expect(component['rectangles'].length).toEqual(1);
    expect(component['onDrag']).toBeTruthy();
    expect(component['currentRectangleIndex']).toEqual(0);
  });

  it('the atributes are not initialised when the wrong button is clicked',
   () => {
    expect(component['rectangles']).toEqual([]);
    expect(component['currentRectangleIndex']).toEqual(-1);
    expect(component['onDrag']).toBeFalsy();
    const event = new MouseEvent('mousedown', {
      offsetX: 10,
      offsetY: 30,
      button: 1 // right click.
    } as MouseEventInit);
    component['service'].borderOption = false;
    component['initRectangle'](event);
    const pointExpected: Point = { x: event.offsetX, y: event.offsetY };
    expect(component['currentPoint']).not.toEqual(pointExpected);
    expect(component['rectangles'].length).not.toEqual(1);
    expect(component['onDrag']).toBeFalsy();
    expect(component['currentRectangleIndex']).toEqual(-1);
  });

  it('the listeners should handle key downs', () => {
    const globKeyEv = new KeyboardEvent('keydown');
    spyOn<any>(component, 'onKeyDown').and.callFake((keyEv: KeyboardEvent) =>
      expect(keyEv).toBe(globKeyEv)
    );
    component.ngOnInit();
    component['svgElRef'].nativeElement.dispatchEvent(globKeyEv);
  });

  it('the listeners should handle key ups', () => {
    const globKeyEv = new KeyboardEvent('keyup');
    spyOn<any>(component, 'onKeyUp').and.callFake((keyEv: KeyboardEvent) =>
      expect(keyEv).toBe(globKeyEv)
    );
    component.ngOnInit();
    component['svgElRef'].nativeElement.dispatchEvent(globKeyEv);
  });

  it('the ngOnInit initialise the arrow of listeners', () => {
    component.ngOnInit();
    expect(component['allListeners'].length).toEqual(5);
  });

  it ('the getPath() should return undifined if the index is out of bound',
  () => {
        component['initRectangle'](createClickMouseEvent('mousedown'));
        component['currentRectangleIndex'] += 1;
        expect(component['getRectangle']()).toBeUndefined();
  });

  it('the rectangle css is only defined by the rectangleService'
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

  it('mouseMove should call the viewTemporaryForm function', fakeAsync(() => {
    const spy1 = spyOn<any>(component, 'viewTemporaryForm').and.callThrough();
    component.svgElRef.nativeElement.dispatchEvent(
      createClickMouseEvent('mousedown')
    );
    component.svgElRef.nativeElement.dispatchEvent(
      createClickMouseEvent('mousemove')
    );
    setTimeout(() => {
      expect(spy1).toHaveBeenCalledTimes(1);
    }, 1000);
    tick(1000);
  }));

  it('mouseMove should not do anything if not on drag', fakeAsync(() => {
    const spy1 = spyOn<any>(component, 'viewTemporaryForm').and.callThrough();
    component.svgElRef.nativeElement.dispatchEvent(
      createClickMouseEvent('mousedown')
    );
    component['onDrag'] = false;
    component.svgElRef.nativeElement.dispatchEvent(
      createClickMouseEvent('mousemove')
    );
    setTimeout(() => {
      expect(spy1).not.toHaveBeenCalled();
    }, 500);
    tick(500);
  }));

  it('viewTemporaryForm should call the function simulateRectangle'
   + 'on mouseMove', fakeAsync(() => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    component.svgElRef.nativeElement.dispatchEvent(
      createClickMouseEvent('mousedown')
    );
    const spy = spyOn<any>(
      component['getRectangle'](),
      'simulateRectangle'
    ).and.callThrough();
    component.svgElRef.nativeElement.dispatchEvent(
      createClickMouseEvent('mousemove')
    );
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
    }, 500);
    tick(500);
  }));

  it('viewTemporaryForm should call the function simulateSquare'
   + 'when shift is pressed ', fakeAsync(() => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    const spy1 = spyOn<any>(component['getRectangle'](), 'simulateSquare');
    const event: MouseEvent = new MouseEvent('mousemove', {
      offsetX: 10,
      offsetY: 30,
      button: 0,
      shiftKey: true
    } as MouseEventInit);
    component['viewTemporaryForm'](event);
    expect(spy1).toHaveBeenCalled();
  }));

  it('a pressed shift should call simulateSquare', () => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    const event = new KeyboardEvent('window:keydown', {
      code: 'ShiftRight',
      key: 'Shift'
    });
    const spy = spyOn<any>(
      component['getRectangle'](),
      'simulateSquare'
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
      'simulateSquare'
    ).and.callThrough();
    const spy2 = spyOn<any>(
      component['getRectangle'](),
      'simulateRectangle'
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
      'simulateSquare'
    ).and.callThrough();
    component['onKeyDown'](event1);
    expect(spy1).not.toHaveBeenCalled();
    const spy2 = spyOn<any>(
      component['getRectangle'](),
      'simulateRectangle'
    ).and.callThrough();
    component['onKeyUp'](event2);
    expect(spy2).not.toHaveBeenCalled();
  });

  it('#onKeyUp should call simulateRectangle', () => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    const event = new KeyboardEvent('window:keyup', {
      code: 'ShiftRight',
      key: 'Shift'
    });
    const spy = spyOn<any>(
      component['getRectangle'](),
      'simulateRectangle'
    ).and.callThrough();
    component['onKeyUp'](event);
    expect(spy).toHaveBeenCalled();
  });

  it('mouseUp should call viewTemporaryForm and setOpacity', fakeAsync(() => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    const spy1 = spyOn<any>(component, 'viewTemporaryForm').and.callThrough();
    spyOn<any>(component, 'getRectangle').and.callThrough();
    const spy2 = spyOn<any>(
      component['getRectangle'](),
      'setOpacity'
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

  it('mouseUp should not do anything if its not on drag', fakeAsync(() => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    const spy1 = spyOn<any>(component, 'viewTemporaryForm').and.callThrough();
    spyOn<any>(component, 'getRectangle').and.callThrough();
    const spy2 = spyOn<any>(
      component['getRectangle'](),
      'setOpacity'
    ).and.callThrough();
    document.dispatchEvent(
      new MouseEvent('mouseup', { button: 0 } as MouseEventInit)
    );
    component['onDrag'] = false;
    setTimeout(() => {
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    }, 500);
    tick(500);
  }));

  it('if the fill atribute is off, the opacity is null', fakeAsync(() => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    spyOn<any>(component, 'getRectangle').and.callThrough();
    component['getRectangle']()['filled'] = false;
    const spy1 = spyOn<any>(
      component['getRectangle'](),
      'setOpacity'
    ).and.callThrough();
    document.dispatchEvent(
      new MouseEvent('mouseup', { button: 0 } as MouseEventInit)
    );
    setTimeout(() => {
      expect(spy1).toHaveBeenCalled();
    }, 500);
    tick(500);
  }));

  it('#onKeyUp should call simulateRectangle', () => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    const event = new KeyboardEvent('window:keyup', {
      code: 'ShiftRight',
      key: 'Shift'
    });
    const spy = spyOn<any>(
      component['getRectangle'](),
      'simulateRectangle'
    ).and.callThrough();
    component['onKeyUp'](event);
    expect(spy).toHaveBeenCalled();
  });

  it(
    'ngOnDestroy should set "called" to true ' +
    '(= call every listener´s functions)',
    () => {
      let called = false;
      component['allListeners'] = [() => (called = true)];
      component.ngOnDestroy();
      expect(called).toBeTruthy();
    }
  );
});
