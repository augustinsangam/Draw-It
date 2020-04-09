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
describe('TextNavHandler', () => {
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
    const line1 = createLine('drawit', 6);
    const line2 = createLine('drawit', 5);
    textNavClass['lines'].push(line1);
    textNavClass['lines'].push(line2);
    textNavClass.cursorRight(line1);
    expect(line2.cursorIndex).toEqual(0);
  });

  it('#cursorRight sould not touch cursorIndex if at the end of the last line', () => {
    const line = createLine('drawit', 6);
    textNavClass['lines'].push(line);
    expect(textNavClass.cursorRight(line).cursorIndex).toEqual(6);
  });

  it('#cursorLeft shoud set cursorIndex at the next line length if at the end of the non last line', () => {
    const line1 = createLine('drawit', 5);
    const line2 = createLine('drawit', 0);
    textNavClass['lines'].push(line1);
    textNavClass['lines'].push(line2);
    textNavClass.cursorLeft(line2);
    expect(line1.cursorIndex).toEqual(6);
  });

  it('#cursorLeft shoud decrement cursorIndex when not at end of line', () => {
    const line = createLine('drawit', 2);
    textNavClass.cursorLeft(line);
    expect(moveWasCalled).toBeTruthy();
    expect(line.cursorIndex).toEqual(1);
  });

  it('#cursorLeft sould not touch cursorIndex if at the start of the first line', () => {
    const line = createLine('drawit', 0);
    textNavClass['lines'].push(line);
    expect(textNavClass.cursorLeft(line).cursorIndex).toEqual(0);
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
