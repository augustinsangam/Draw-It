import {TextService} from '../text.service';
import {LetterDeleterHandler} from './letter-deleter-handler';
import {TextLine} from './text-line';

// tslint:disable:no-magic-numbers
const createLine = (sentence: string) => {
  return new TextLine(
    {textContent: sentence, getAttribute: (() => true) as () => boolean} as unknown as SVGElement,
    Array.from(sentence),
    2,
  );
};

// tslint:disable:no-string-literal no-any
describe('LetterDeleteHandlers', () => {
  let letterDeleterClass: LetterDeleterHandler;

  beforeEach(() => {
    letterDeleterClass = new LetterDeleterHandler([], {fontSize: 42} as unknown as TextService);
  });

  it('#should create', () => {
    expect(letterDeleterClass).toBeTruthy();
  });

  it('#deleteRightLetter should not do anything if the text is empty', () => {
    const testLine = createLine('asd');
    testLine.cursorIndex = 3;
    letterDeleterClass['lines'].push(testLine);
    const returnedLine = letterDeleterClass['deleteRightLetter'](testLine);
    expect(returnedLine.tspan.textContent).toEqual('asd');
    expect(returnedLine.cursorIndex).toEqual(3);
  });

  it('#deleteRightLetter should remove right letter if not at end of line but not at last letter', () => {
    const testLine = createLine('drawit');
    testLine.cursorIndex = 2;
    letterDeleterClass['lines'].push(testLine);
    const returnedLine = letterDeleterClass['deleteRightLetter'](testLine);
    expect(returnedLine.letters.join('')).toEqual('drwit');
    expect(returnedLine.cursorIndex).toEqual(2);
  });

  it('#deleteRightLetter should remove right letter if not at end of line but at last letter', () => {
    const testLine = createLine('drawit');
    testLine.cursorIndex = 5;
    letterDeleterClass['lines'].push(testLine);
    const returnedLine = letterDeleterClass['deleteRightLetter'](testLine);
    expect(returnedLine.letters.join('')).toEqual('drawi');
    expect(returnedLine.cursorIndex).toEqual(5);
  });

  it('#deleteRightLetter should merge the two lines if called at end of the non last line', () => {
    const testLine1 = createLine('drawit');
    const testLine2 = createLine('drawit');
    testLine1.cursorIndex = 6;
    testLine2.cursorIndex = 2;
    letterDeleterClass['lines'].push(testLine1);
    letterDeleterClass['lines'].push(testLine2);
    spyOn(testLine1, 'moveUp');
    spyOn(testLine2, 'moveUp');
    spyOn(testLine2, 'emptySelf');
    const returnedLine = letterDeleterClass['deleteRightLetter'](testLine1);
    expect(returnedLine.letters.join('')).toEqual('drawitdrawit');
    expect(returnedLine.cursorIndex).toEqual(6);
  });

  it('#deleteLeftLetter should not do anything if the text is empty', () => {
    const testLine = createLine('asd');
    testLine.cursorIndex = 0;
    letterDeleterClass['lines'].push(testLine);
    const returnedLine = letterDeleterClass['deleteLeftLetter'](testLine);
    expect(returnedLine.tspan.textContent).toEqual('asd');
    expect(returnedLine.cursorIndex).toEqual(0);
  });

  it('#deleteLeftLetter should remove left letter if not at start of line and not at first letter', () => {
    const testLine = createLine('drawit');
    testLine.cursorIndex = 2;
    letterDeleterClass['lines'].push(testLine);
    const returnedLine = letterDeleterClass['deleteLeftLetter'](testLine);
    expect(returnedLine.letters.join('')).toEqual('dawit');
    expect(returnedLine.cursorIndex).toEqual(1);
  });

  it('#deleteLeftLetter should remove left letter if not at end of line but at last letter', () => {
    const testLine = createLine('drawit');
    testLine.cursorIndex = 1;
    letterDeleterClass['lines'].push(testLine);
    const returnedLine = letterDeleterClass['deleteLeftLetter'](testLine);
    expect(returnedLine.letters.join('')).toEqual('rawit');
    expect(returnedLine.cursorIndex).toEqual(0);
  });

  it('#deleteLeftLetter should merge the two lines if called at start of the non first line', () => {
    const testLine1 = createLine('drawit');
    const testLine2 = createLine('drawit');
    testLine1.cursorIndex = 2;
    testLine2.cursorIndex = 0;
    letterDeleterClass['lines'].push(testLine1);
    letterDeleterClass['lines'].push(testLine2);
    spyOn(testLine1, 'moveUp');
    spyOn(testLine2, 'moveUp');
    spyOn(testLine2, 'emptySelf');
    const returnedLine = letterDeleterClass['deleteLeftLetter'](testLine2);
    expect(returnedLine.letters.join('')).toEqual('drawitdrawit');
    expect(returnedLine.cursorIndex).toEqual(6);
  });

});
