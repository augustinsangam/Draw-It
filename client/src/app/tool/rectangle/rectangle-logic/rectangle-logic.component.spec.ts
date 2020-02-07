import { ElementRef, Renderer2 } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ColorService } from '../../color/color.service';
import {Point} from '../../tool-common classes/Point'
import { ToolLogicComponent } from '../../tool-logic/tool-logic.component';
import { RectangleService } from '../rectangle.service';
import { RectangleLogicComponent } from './rectangle-logic.component';

const createClickMouseEvent = (event: string): MouseEvent => {
  return new MouseEvent(event, { offsetX: 10, offsetY: 30, button: 0 } as MouseEventInit);
}
// tslint:disable:no-string-literal
fdescribe('RectangleLogicComponent', () => {
  let component: RectangleLogicComponent;
  let fixture: ComponentFixture<RectangleLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectangleLogicComponent, ToolLogicComponent ],
      providers: [Renderer2, ColorService, RectangleService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleLogicComponent);
    component = fixture.componentInstance;
    component.svgElRef = new ElementRef<SVGElement>(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
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
    }, 1000);
    tick(1000);
  }));

  it('in initRectangle() currentPoint should be equal to the mouse coordinates, the array should be initialised', fakeAsync(() => {
    const mouseEv: MouseEvent = createClickMouseEvent('mousedown');
    const pointExpected: Point = {x: mouseEv.offsetX, y: mouseEv.offsetY};
    component['initRectangle'](mouseEv);
    expect(component['currentPoint']).toEqual(pointExpected);
    expect(component['rectangles'].length).toEqual(1);
    expect(component['onDrag']).toBeTruthy();
  }));

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

  it('viewTemporaryForm should call the function drawTemporaryRectangle on mouseMove', fakeAsync(() => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    component.svgElRef.nativeElement.dispatchEvent(
      createClickMouseEvent('mousedown')
      );
    const spy = spyOn<any>(component['getRectangle'](), 'drawTemporaryRectangle').and.callThrough();
    component.svgElRef.nativeElement.dispatchEvent(
      createClickMouseEvent('mousemove')
    );
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
    }, 1000);
    tick(1000);
  }));

  it('viewTemporaryForm should call the function drawTemporarySquare when shift is pressed ', fakeAsync(() => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    const spy1 = spyOn<any>(component['getRectangle'](), 'drawTemporarySquare');
    const event: MouseEvent = new MouseEvent('mousemove', { offsetX: 10, offsetY: 30, button: 0, shiftKey: true } as MouseEventInit);
    component['viewTemporaryForm'](event);
    expect(spy1).toHaveBeenCalled();
  }));

  it('#onKeyDown should call drawTemporarySquare', ()  => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    const event = new KeyboardEvent('window:keydown', {
      code: 'ShiftRight',
      key: 'Shift'
    });
    component['onKeyDown'](event);
    spyOn<any>(component['getRectangle'](), 'drawTemporaryRectangle').and.callThrough();
  });

  it('#onKeyUp should call drawTemporaryRectangle', ()  => {
    component['initRectangle'](createClickMouseEvent('mousedown'));
    const event = new KeyboardEvent('window:keyup', {
      code: 'ShiftRight',
      key: 'Shift'
    });
    component['onKeyUp'](event);
    spyOn<any>(component['getRectangle'](), 'drawTemporaryRectangle').and.callThrough();
  });

  // it('when the shift is pressed the renderer.listen should be called', fakeAsync(()  => {
  //   component['initRectangle'](createClickMouseEvent('mousedown'));

  //   const event = new KeyboardEvent('window:keydown', {
  //     code: 'ShiftRight',
  //     key: 'Shift'
  //   });

  //   const spy = spyOn<any>(component, 'onKeyDown').and.callThrough();

  //   component.ngOnInit();
  //   tick();

  //   document.dispatchEvent(event);
  //   tick();

  //   setTimeout(() => {
  //     expect(spy).toHaveBeenCalled();
  //   }, 500);

  //   tick(500);

  // }));

});
// component.viewTemporaryForm(mouseEv);
// let pathExpected: string = ' L' + mouseEv.offsetX + ',' + mouseEv.offsetY;
// pathExpected += ' M' + mouseEv.offsetX + ',' + mouseEv.offsetY;
