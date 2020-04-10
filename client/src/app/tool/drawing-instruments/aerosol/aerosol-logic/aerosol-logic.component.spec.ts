import {
  async,
  ComponentFixture, fakeAsync,
  TestBed, tick,
} from '@angular/core/testing';

import {Point} from '../../../shape/common/point';
import { UndoRedoService } from '../../../../undo-redo/undo-redo.service';
import { AerosolLogicComponent } from './aerosol-logic.component';

const createClickMouseEvent = (event: string): MouseEvent =>  new MouseEvent(
  event,  {
    offsetX: 420,
    offsetY: 420,
    button: 0
  } as MouseEventInit
);

// tslint:disable:no-string-literal no-any no-magic-numbers
describe('AerosolLogicComponent', () => {
  let component: AerosolLogicComponent;
  let fixture: ComponentFixture<AerosolLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AerosolLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AerosolLogicComponent);
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

    (TestBed.get(UndoRedoService) as UndoRedoService).intialise(component.svgStructure);
    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onMouseDown should subscribe the frequency to the' +
    ' periodicSplashAdder of the component, and start splashing',  fakeAsync(() => {
    component['service'].frequency = 100;
    const spy = spyOn<any>(component, 'addSplash');
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mousedown'));
    setTimeout(() => {
      expect(spy).toHaveBeenCalledTimes(9);
      component['periodicSplashAdder'].unsubscribe();
      },
      100
    );
    tick(100);
  }));

  it('#onMouseMove should update currentMousePos if onDrag', () => {
    component['onDrag'] = true;
    const mouseEv = createClickMouseEvent('mousemove');
    const expectedPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
    component['onMouseMove'](mouseEv);
    expect(component['currentMousePos']).toEqual(expectedPoint);
  });

  it ('#onMouseMove should not update currentMousePos if not onDrag', () => {
    const expectedPoint = new Point(43, 43);
    component['currentMousePos'] = expectedPoint;
    component['onDrag'] = false;
    component['onMouseMove'](createClickMouseEvent('mousemove'));
    expect(component['currentMousePos']).toEqual(expectedPoint);
  });

  it ('#onMouseUp should stop the splash if onDrag and to call' +
    ' saveState from undoRedoService', () => {
    component['onMouseDown'](createClickMouseEvent('mousedown'));
    expect(component['onDrag']).toBeTruthy();
    const spy = spyOn(component['undoRedoService'], 'saveState');
    component['onMouseUp']();
    expect(component['onDrag']).toBeFalsy();
    expect(component['stringPath']).toEqual('');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it ('#onMouseUp should not do anything if not onDrag', fakeAsync(() => {
    const spy = spyOn(component['undoRedoService'], 'saveState');
    component['onMouseDown'](createClickMouseEvent('mousedown'));
    setTimeout(() => {
      component['onDrag'] = false;
      component['periodicSplashAdder'].unsubscribe();
    }, 200);
    tick(200);
    spyOn(component['periodicSplashAdder'], 'unsubscribe');
    component['onMouseUp']();
    expect(component['periodicSplashAdder']).not.toBeUndefined();
    expect(component['onDrag']).toBeFalsy();
    expect(component['stringPath']).not.toEqual('');
    expect(spy).toHaveBeenCalledTimes(0);
  }));

  it('#addSplash should call generatePoint and add the result ' +
    'in the currentPath', () => {
    const dummyPath = 'M 190.1649298384418, 139.4657776162013 ' +
      'a 1, 1 0 1, 0 2,0 a 1, 1 0 1, 0 -2,0';
    const spy = spyOn(component['service'], 'generatePoints').and.callFake(
      () => dummyPath
      );
    component['currentPath'] = component['renderer'].createElement('path', component['svgNS']);
    component['addSplash']();
    expect(spy).toHaveBeenCalled();
    expect(component['currentPath'].getAttribute('d')).toEqual(dummyPath);
  });

  it('#the ngOnInit should initialise the arrow of' +
    ' listeners', () => {
    component.ngOnInit();
    expect(component['listeners'].length).toEqual(4);
  });

  it('#A mouseleave should call onMouseUp function', () => {
    const spy = spyOn<any>(component, 'onMouseUp');
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mouseleave'));
    expect(spy).toHaveBeenCalled();
  });

  it('#A mouseup should call onMouseUp function', () => {
    const spy = spyOn<any>(component, 'onMouseUp');
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mouseup'));
    expect(spy).toHaveBeenCalled();
  });

  it('#A mousemove should call onMouseMove function', () => {
    const spy = spyOn<any>(component, 'onMouseMove');
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mousemove'));
    expect(spy).toHaveBeenCalled();
  });

  it('#Undo redo override function should remove current path the drawing is not finished', () => {
    component['onDrag'] = true;
    component['currentPath'] = { remove: () => { return ; } } as SVGElement;
    const spy = spyOn(component['currentPath'], 'remove');
    (component['undoRedoService']['actions'].undo[0].overrideFunction as () => void)();
    expect(spy).toHaveBeenCalled();
  });

  it('#Undo redo override function should not do anything if the drawing is finished', () => {
    component['onDrag'] = false;
    component['currentPath'] = { remove: () => { return ; } } as SVGElement;
    const spy = spyOn(component['currentPath'], 'remove');
    (component['undoRedoService']['actions'].undo[0].overrideFunction as () => void)();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#Mouse down event handler consider only left mouse actions', fakeAsync(() => {
    component['service'].frequency = 100;
    const spy = spyOn<any>(component, 'onMouseDown');
    component.svgStructure.root.dispatchEvent(new MouseEvent(
      'mousedown', {
        offsetX: 420,
        offsetY: 420,
        button: 1
      } as MouseEventInit)
    );
    setTimeout(() => {
      expect(spy).not.toHaveBeenCalled();
    }, 100);
    tick(100);
  }));

});
