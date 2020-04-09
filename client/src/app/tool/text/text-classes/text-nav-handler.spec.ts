import {Cursor} from './cursor';
import {TextLine} from './text-line';
import {TextNavHandler} from './text-nav-handler';

const createLine = (sentence: string, index: number) => {
  return new TextLine(
    {textContent: sentence} as unknown as SVGElement,
    Array.from(sentence),
    index
  );
};

// tslint:disable:no-magic-numbers no-string-literal
fdescribe('TextNavHandler', () => {
  let textNavClass: TextNavHandler;
  let moveWasCalled: boolean;

  beforeEach(() => {
    const cursor = {
      move: () => moveWasCalled = true,
    } as unknown as Cursor;

    moveWasCalled = false;

    textNavClass = new TextNavHandler(cursor, []);
  });

  it('#should create', () => {
    expect(textNavClass).toBeTruthy();
  });

  it('#cursorRight shoud increment cursorIndex when not at end of line', () => {
    const line = createLine('drawit', 2);
    textNavClass.cursorRight(line);
    expect(moveWasCalled).toBeTruthy();
    expect(line.cursorIndex).toEqual(3);
  });

  it('#cursorRight shoud set cursorIndex at 0 if at the end of the non last line', () => {
    const line = createLine('', 0);
    textNavClass['lines'].push(line);
    textNavClass['lines'].push(line);
    textNavClass.cursorRight(line);
    expect(moveWasCalled).toBeFalsy();
    expect(line.cursorIndex).toEqual(0);
  });

  it('#cursorLeft shoud call move on an non empty sentence', () => {
    textNavClass.cursorLeft(createLine('drawit', 2));
    expect(moveWasCalled).toBeTruthy();
  });

  it('#cursorLeft shoud not call move on an empty sentence', () => {
    textNavClass.cursorLeft(createLine('', 0));
    expect(moveWasCalled).toBeFalsy();
  });

  it('#cursorUp should call move when not on first line, and when the upper cursor is on the right', () => {
    textNavClass['lines'].push(createLine('drawit', 5));
    textNavClass['lines'].push(createLine('testbed', 2));
    textNavClass.cursorUp(textNavClass['lines'][1]);
    expect(moveWasCalled).toBeTruthy();
  });

  it('#cursorUp should call move when not on first line, and when the upper cursor is on the left', () => {
    textNavClass['lines'].push(createLine('test', 0));
    textNavClass['lines'].push(createLine('drawit', 5));
    textNavClass.cursorUp(textNavClass['lines'][1]);
    expect(moveWasCalled).toBeTruthy();
  });

  it('#cursorUp should not call move when on first line', () => {
    textNavClass['lines'].push(createLine('drawit', 5));
    textNavClass['lines'].push(createLine('testbed', 2));
    textNavClass.cursorUp(textNavClass['lines'][0]);
    expect(moveWasCalled).toBeFalsy();
  });

  it('#cursorDown should call move when not on last line, and when the lower cursor is on the right', () => {
    textNavClass['lines'].push(createLine('drawit', 5));
    textNavClass['lines'].push(createLine('testbed', 2));
    textNavClass.cursorDown(textNavClass['lines'][0]);
    expect(moveWasCalled).toBeTruthy();
  });

  it('#cursorDown should call move when on last line, and when the lower cursor is on the left', () => {
    textNavClass['lines'].push(createLine('drawit', 5));
    textNavClass['lines'].push(createLine('test', 0));
    textNavClass.cursorDown(textNavClass['lines'][0]);
    expect(moveWasCalled).toBeTruthy();
  });

  it('#cursorUp should not call move when on last line', () => {
    textNavClass['lines'].push(createLine('drawit', 5));
    textNavClass['lines'].push(createLine('testbed', 2));
    textNavClass.cursorDown(textNavClass['lines'][1]);
    expect(moveWasCalled).toBeFalsy();
  });

  it('#keyHome should set the cursorIndex to the start of line and call move', () => {
    textNavClass['lines'].push(createLine('drawit', 4));
    textNavClass.keyHome(textNavClass['lines'][0]);
    expect(textNavClass['lines'][0].cursorIndex).toEqual(0);
    expect(moveWasCalled).toBeTruthy();
  });

  it('#keyEnd should set the cursorIndex at the end of line and call move', () => {
    textNavClass['lines'].push(createLine('drawit', 0));
    textNavClass.keyEnd(textNavClass['lines'][0]);
    expect(textNavClass['lines'][0].cursorIndex).toEqual(6);
    expect(moveWasCalled).toBeTruthy();
  });

  it('#keyEnd should not change the cursorIndex on an empty line', () => {
    textNavClass['lines'].push(createLine('', 0));
    textNavClass.keyEnd(textNavClass['lines'][0]);
    expect(textNavClass['lines'][0].cursorIndex).toEqual(0);
    expect(moveWasCalled).toBeTruthy();
  });

});
