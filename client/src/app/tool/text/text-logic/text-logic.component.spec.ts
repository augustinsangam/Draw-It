import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UndoRedoService} from '../../../undo-redo/undo-redo.service';
import {Point} from '../../shape/common/point';
import {Rectangle} from '../../shape/common/rectangle';
import {Cursor} from '../text-classes/cursor';
import {LetterDeleterHandler} from '../text-classes/letter-deleter-handler';
import {TextAlignement} from '../text-classes/text-alignement';
import {TextHandlers} from '../text-classes/text-handlers';
import {TextLine} from '../text-classes/text-line';
import {TextNavHandler} from '../text-classes/text-nav-handler';
import {TextService} from '../text.service';
import {TextLogicComponent} from './text-logic.component';

const createClickMouseEvent = (event: string): MouseEvent => {
  return new MouseEvent(event, {
    offsetX: 10,
    offsetY: 30,
    button: 0
  } as MouseEventInit);
};

// tslint:disable:no-string-literal no-magic-numbers no-any max-file-line-count
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

  it('#a KeyDown should call the onKeyDown method when onType', () => {
    component['indicators'].onType = true;
    const spy = spyOn<any>(component, 'onKeyDown');
    document.dispatchEvent(new KeyboardEvent('keydown'));
    expect(spy).toHaveBeenCalled();
    component['indicators'].onType = false;
  });

  it('#a KeyDown should not call the onKeyDown method when not onType', () => {
    component['indicators'].onType = false;
    const spy = spyOn<any>(component, 'onKeyDown');
    document.dispatchEvent(new KeyboardEvent('keydown'));
    expect(spy).not.toHaveBeenCalled();
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
    component['handlers'] = {
      textNav: new TextNavHandler(component['cursor'], component['lines']),
      letterDelete: new LetterDeleterHandler([], {} as unknown as TextService)
    } as TextHandlers;
    let letterAdded = 0;
    const spyOnLettersAdded = spyOn<any>(component, 'addLetterAtCursor').and.callFake(() => ++letterAdded);
    spyOn<any>(component, 'updateView');
    const methods = new Map([
      ['Escape',     spyOn<any>(component,                          'cancelTyping')],
      ['Enter',      spyOn<any>(component,                          'addLine')],
      ['Home',       spyOn(component['handlers'].textNav,           'keyHome')],
      ['End',        spyOn(component['handlers'].textNav,           'keyEnd')],
      ['ArrowLeft',  spyOn(component['handlers'].textNav,           'cursorLeft')],
      ['ArrowRight', spyOn(component['handlers'].textNav,      'cursorRight')],
      ['ArrowUp',    spyOn(component['handlers'].textNav,      'cursorUp')],
      ['ArrowDown',  spyOn(component['handlers'].textNav,           'cursorDown')],
      ['Delete',     spyOn(component['handlers'].letterDelete, 'deleteRightLetter')],
      ['Backspace',  spyOn(component['handlers'].letterDelete, 'deleteLeftLetter')],
      ['Space',      spyOnLettersAdded],
      ['x',          spyOnLettersAdded],
    ]);

    methods.forEach((spy, keyMap ) => {
      component['onKeyDown'](new KeyboardEvent('keydown', {key: keyMap}));
      expect(spy).toHaveBeenCalled();
    });
    expect(letterAdded).toEqual(2);

    component['onKeyDown'](new KeyboardEvent('keydown', {key: 'Shift'}));
    expect(spyOnLettersAdded).toHaveBeenCalledTimes(2);
    component['indicators'].onType = false;
  });

  it('#onMouseUp should get the rectangle up left corner, and not startTyping if already onType', () => {
    spyOn(component['mathService'], 'getRectangleSize');
    const spyOnRect = spyOn(component['mathService'], 'getRectangleUpLeftCorner');
    const spyOnStart = spyOn<any>(component, 'startTyping');
    component['indicators'].onType = true;
    component['onMouseUp'](createClickMouseEvent('mouseup'));
    expect(spyOnRect).toHaveBeenCalled();
    expect(spyOnStart).not.toHaveBeenCalled();
    component['indicators'].onType = false;
  });

  it('#onMouseUp should get the rectangle up left corner, and not startTyping if already onType', () => {
    spyOn(component['mathService'], 'getRectangleSize');
    spyOn(component['mathService'], 'getRectangleUpLeftCorner');
    const spyOnStart = spyOn<any>(component, 'startTyping');
    component['indicators'].onType = false;
    component['onMouseUp'](createClickMouseEvent('mouseup'));
    expect(spyOnStart).toHaveBeenCalled();
    component['indicators'].onType = false;
  });

  it('#initRectVisu shoud set the style of the rectangle', () => {
    const spy = spyOn(component['renderer'], 'setStyle');
    component['initRectVisu'](createClickMouseEvent('mousedown'));
    expect(spy).toHaveBeenCalled();
  });

  it('#initCursor should create a cursor and create a handlers attribute, alignement left', () => {
    const alignements = ['left', 'center', 'right'];
    component['service'].currentZoneDims = {width: 100, height: 100};
    alignements.forEach((align) => {
      component['service'].textAlignement = align as TextAlignement;
      component['initialPoint'] = new Point(42, 69);
      component['cursor'] = undefined as unknown as Cursor;
      component['handlers'] = {
        textNav: undefined as unknown as TextNavHandler,
        letterDelete: undefined as unknown as LetterDeleterHandler
      } as TextHandlers;
      component['initCursor']();
      expect(component['cursor']).toBeTruthy();
      expect(component['handlers'].textNav).toBeTruthy();
      expect(component['handlers'].letterDelete).toBeTruthy();
    });
  });

  it('#initSVGText should call the addLine method', () => {
    const spy = spyOn<any>(component, 'addLine');
    component['initSVGText']();
    expect(spy).toHaveBeenCalled();
  });

  it('#startTyping should call initCursor method', () =>  {
    const spy = spyOn<any>(component, 'initCursor');
    spyOn<any>(component, 'initSVGText');
    component['startTyping']();
    expect(spy).toHaveBeenCalled();
    component['indicators'].onType = false;
  });

  it('#cancelTyping should empty the lines attribute and set onDrag to false', () => {
    component['initialPoint'] = new Point(42, 69);
    const textEl = component['renderer'].createElement('text', component.svgNS);
    component['textElement'] = textEl;
    component['renderer'].appendChild(component.svgStructure.drawZone, textEl);
    component['addLine']();
    const spy = spyOn(component['lines'][0].tspan, 'remove');
    spyOn<any>(component, 'stopTyping');
    component['indicators'].onDrag = true;
    component['cancelTyping']();
    expect(component['indicators'].onDrag).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('#stopTyping should call the saveState method if called with false, and should reactivate every shortcut', () => {
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mousedown'));
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mouseup'));
    const spySaveState = spyOn(component['undoRedoService'], 'saveState');
    const spyOnShortcuts = spyOn(component['shortcutService'], 'activateAll');
    component['stopTyping'](false);
    expect(spySaveState).toHaveBeenCalled();
    expect(spyOnShortcuts).toHaveBeenCalled();
  });

  it('#stopTyping should not call remove on the text, and not call saveState if called with true', () => {
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mousedown'));
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mouseup'));
    component['currentLine'].tspan.textContent = 'DrawIt!';
    const spySaveState = spyOn(component['undoRedoService'], 'saveState');
    component['stopTyping'](true);
    expect(spySaveState).not.toHaveBeenCalled();
  });

  it('#addTspan should push a new line', () => {
    const initialSize = component['lines'].length;
    component['initialPoint'] = new Point(42, 69);
    spyOn(component['renderer'], 'appendChild');
    component['addLine']();
    expect(component['lines'].length).toEqual(initialSize + 1);
  });

  it('#addLine should splitAtCursor and call moveDown on the right Lines', () => {
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mousedown'));
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mouseup'));
    let splitWasCalled = false;
    let moveWasCalled = false;
    const lineTest = {
      tspan: undefined as unknown as SVGElement,
      splitAtCursor: () => splitWasCalled = true,
      moveDown: () => moveWasCalled = true,
    } as unknown as TextLine;
    component['currentLine'] = lineTest;
    spyOn(component['lines'], 'slice').and.callFake(() => [lineTest]);
    spyOn(component['renderer'], 'appendChild');
    spyOn(component['renderer'], 'setStyle');
    spyOn(component['renderer'], 'setAttribute');
    component['addLine']();
    expect(splitWasCalled).toBeTruthy();
    expect(moveWasCalled).toBeTruthy();
    component['indicators'].onType = false;
  });

  it('#addLetterAtCursor increment currentLine CursorIndex', () => {
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mousedown'));
    component.svgStructure.root.dispatchEvent(createClickMouseEvent( 'mouseup'));
    component['addLetterAtCursor']('x');
    component['onKeyDown'](new KeyboardEvent('keydown', {key: 'ArrowLeft'}));
    component['addLetterAtCursor']('y');
    expect(component['currentLine'].letters).toEqual(['y', 'x']);
  });

  it('#setTextStyle should call all the textStyle functions', () => {
    component['service'].textMutators = {underline: true, bold: true, italic: true};
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mousedown'));
    component.svgStructure.root.dispatchEvent(createClickMouseEvent( 'mouseup'));
    const spy = spyOn(component['textElement'], 'setAttribute');
    component['setTextStyle']();
    expect(spy).toHaveBeenCalledTimes(7);
  });

  it('#updateView should move the cursor to the right place', () => {
    component.svgStructure.root.dispatchEvent(createClickMouseEvent('mousedown'));
    component.svgStructure.root.dispatchEvent(createClickMouseEvent( 'mouseup'));
    const spy = spyOn(component['cursor'], 'move');
    component['updateView']();
    expect(spy).toHaveBeenCalled();
  });

});
