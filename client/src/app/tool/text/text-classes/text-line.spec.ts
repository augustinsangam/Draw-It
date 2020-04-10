import {TextLine} from './text-line';

// tslint:disable:no-magic-numbers
describe('TextLine', () => {
  let textLineClass: TextLine;

  beforeEach(() => {
    const tspan = {
      setAttribute: () => true,
      getAttribute: () => true,
      remove: () => true,
      textContent: ''
    } as unknown as SVGElement;

    textLineClass = new TextLine(tspan, [], 0);
  });

  it('#should create', () => {
    expect(textLineClass).toBeTruthy();
  });

  it('#moveUp should call the setAttribute method of tspan if it can get the y coordinate', () => {
    spyOn(textLineClass.tspan, 'getAttribute').and.callFake(() => '10');
    const spy = spyOn(textLineClass.tspan, 'setAttribute');
    textLineClass.moveUp(10);
    expect(spy).toHaveBeenCalled();
  });

  it('#moveUp should not call the setAttribute method of tspan if it cannot get the y coordinate', () => {
    spyOn(textLineClass.tspan, 'getAttribute').and.callFake(() => null);
    const spy = spyOn(textLineClass.tspan, 'setAttribute');
    textLineClass.moveUp(10);
    expect(spy).not.toHaveBeenCalled();
  });

  it('#moveDown should call the setAttribute method', () => {
    const spy = spyOn(textLineClass.tspan, 'setAttribute');
    textLineClass.moveDown(10, 10, 10);
    expect(spy).toHaveBeenCalled();
  });

  it('#splitAtCursor should return a sliced line at the cursor index', () => {
    textLineClass.tspan.textContent = 'drawit';
    textLineClass.letters = Array.from('drawit');
    const returnedLine = textLineClass.splitAtCursor(3, {textContent: ''} as unknown as SVGElement);
    expect(returnedLine.letters).toEqual(Array.from('wit'));
    expect(returnedLine.tspan.textContent).toEqual('wit');
  });

  it('#emptySelf should call remove and clear itself', () => {
    const spy = spyOn(textLineClass.tspan, 'remove');
    textLineClass.letters = Array.from('drawit');
    textLineClass.cursorIndex = 6;
    textLineClass.emptySelf();
    expect(spy).toHaveBeenCalled();
    expect(textLineClass.letters).toEqual([]);
    expect(textLineClass.cursorIndex).toEqual(0);
  });

  it('#append should append the argument to itSelf', () => {
    const testLine = {letters: Array.from('drawit')} as unknown as TextLine;
    textLineClass.letters = Array.from('drawit');
    textLineClass.append(testLine);
    expect(textLineClass.letters).toEqual(Array.from('drawitdrawit'));
    expect(textLineClass.tspan.textContent).toEqual('drawitdrawit');
  });
});
