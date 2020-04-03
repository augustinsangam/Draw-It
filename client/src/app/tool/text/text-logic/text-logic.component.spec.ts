import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {Point} from '../../shape/common/point';
import {Rectangle} from '../../shape/common/rectangle';
import {UndoRedoService} from '../../undo-redo/undo-redo.service';
import {Cursor} from '../cursor';
import {TextNavHandler} from '../text-nav-handler';
import {TextLogicComponent} from './text-logic.component';

const createClickMouseEvent = (event: string): MouseEvent => {
  return new MouseEvent(event, {
    offsetX: 10,
    offsetY: 30,
    button: 0
  } as MouseEventInit);
};

// tslint:disable:no-string-literal no-magic-numbers no-any
describe('TextLogicComponent', () => {
  let component: TextLogicComponent;
  let fixture: ComponentFixture<TextLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextLogicComponent);
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

    const rectElement = component['renderer'].createElement('rect', component.svgNS);
    component['service'].textZoneRectangle = new Rectangle(component['renderer'], rectElement, component['mathService']);
    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should initialize all the listeners and set up the mouse cursor', () => {
    component['listeners'] = [];
    const spy = spyOn(component['renderer'], 'setStyle');
    component.ngOnInit();
    expect(component['listeners'].length).toEqual(5);
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseUp should call onMouseUp if the click was in the textZone', () => {
    component['indicators'].onType = false;
    const spy = spyOn<any>(component, 'onMouseUp');
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mouseup'));
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseUp should call stopTyping if not clicking in the text Zone and onType', () => {
    let called = false;
    spyOn<any>(component, 'stopTyping').and.callFake(() => called = true);
    const textZoneRect = component['renderer'].createElement('rect', component.svgNS);
    const rect = new Rectangle(component['renderer'], textZoneRect, component['mathService']);
    rect.dragRectangle(new Point(0, 0), new Point(5, 5));
    component['indicators'].onType = true;
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mouseup'));
    expect(called).toBeTruthy();
    component['indicators'].onType = false;
  });

  it('#on a mousedown the listener should initialize the rectangle if not already onType', () => {
    const spy = spyOn<any>(component, 'initRectVisu');
    component['indicators'].onType = false;
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mousedown'));
    expect(spy).toHaveBeenCalled();
  });

  it('#on a mousedown the listener should initialize the rectangle if not already onType', () => {
    const spy = spyOn<any>(component, 'initRectVisu');
    component['indicators'].onType = true;
    component['indicators'].onDrag = false;
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mousedown'));
    expect(spy).not.toHaveBeenCalled();
    expect(component['indicators'].onDrag).toBeFalsy();
    component['indicators'].onType = false;
  });

  it('#mouseLeave should remove the textZoneRectangle if not onType and onDrag', () => {
    component['indicators'] = {onType: false, onDrag: true};
    const spy = spyOn(component['service'].textZoneRectangle.element, 'remove');
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mouseleave'));
    expect(spy).toHaveBeenCalled();
    expect(component['indicators'].onDrag).toBeFalsy();
  });

  it('#mouseLeave should not remove the textZoneRectangle if onType or not onDrag', () => {
    component['indicators'] = {onType: true, onDrag: false};
    const spy = spyOn(component['service'].textZoneRectangle.element, 'remove');
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mouseleave'));
    expect(spy).not.toHaveBeenCalled();
    expect(component['indicators'].onDrag).toBeFalsy();
    component['indicators'].onType = false;
  });

  it('#a mousemove event should call dragRectangle when we are onDrag', () => {
    component['indicators'].onDrag = true;
    const spy = spyOn(component['service'].textZoneRectangle, 'dragRectangle');
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mousemove'));
    expect(spy).toHaveBeenCalled();
  });

  it('#a mousemove event should not call dragRectangle when we are not onDrag', () => {
    component['indicators'].onDrag = false;
    const spy = spyOn(component['service'].textZoneRectangle, 'dragRectangle');
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mousemove'));
    expect(spy).not.toHaveBeenCalled();
  });

  // TODO "SPEC HAS NO EXPECTATIONS" -> YES IT HAS
  it('#a KeyDown should calls the onKeyDown method when onType', () => {
    component['indicators'].onType = true;
    const testKeyEvent = new KeyboardEvent('keydown');
    spyOn<any>(component, 'onKeyDown').and.callFake((keyEv: KeyboardEvent) => {
      expect(keyEv).toEqual(testKeyEvent);
    });
    component.ngOnInit();
    component.svgStructure.root.dispatchEvent(testKeyEvent);
    component['indicators'].onType = false;
  });

  it('#ngOnDestroy should call stopTyping if onType to handle the tool switch', () => {
    let called = false;
    component['indicators'].onType = true;
    spyOn<any>(component,  'stopTyping').and.callFake(() => called = true);
    component.ngOnDestroy();
    expect(called).toBeTruthy();
    component['indicators'].onType = false;
  });

  it('#onKeyDown should call the associated methods for each key pressed', () => {
    const cursor = component['renderer'].createElement('path', component.svgNS);
    component['cursor'] = new Cursor(component['renderer'], component['service'], cursor, new Point(10, 10));
    component['textNavHandler'] = new TextNavHandler(component['cursor'], component['lines']);

    const methods = new Map([
      ['Escape',     spyOn<any>(component,                    'cancelTyping')],
      ['Enter',      spyOn<any>(component,                    'addLine')],
      ['Home',       spyOn(component['textNavHandler'],       'keyHome')],
      ['End',        spyOn(component['textNavHandler'],       'keyEnd')],
      ['ArrowLeft',  spyOn(component['textNavHandler'],       'cursorLeft')],
      ['ArrowRight', spyOn<any>(component['textNavHandler'],  'cursorRight')],
      ['ArrowUp',    spyOn<any>(component['textNavHandler'],  'cursorUp')],
      ['ArrowDown',  spyOn(component['textNavHandler'],       'cursorDown')],
      ['BackSpace',  spyOn<any>(component,                    'deleteLeftLetter')],
      ['Delete',     spyOn<any>(component,                    'deleteRightLetter')],
      // ['Space',      spyOn<any>(component,                    'addLetterAtCursor')],
      ['x',          spyOn<any>(component,                    'addLetterAtCursor')],
    ]);

    methods.forEach((spy, keyMap ) => {
      component.svgStructure.root.dispatchEvent(new KeyboardEvent('keydown', {key: keyMap}));
      expect(spy).toHaveBeenCalled();
    });
  });

});
