import {TestBed} from '@angular/core/testing';

import {TextAlignement} from './text-classes/text-alignement';
import {TextLine} from './text-classes/text-line';
import {TextService} from './text.service';

// tslint:disable:no-magic-numbers
const createLine = (sentence: string) => {
  return {
    tspan: {textContent: sentence, getComputedTextLength: (() => 42) as () => number} as unknown as SVGElement,
    cursorIndex: 2,
    letters: Array.from(sentence)
  } as TextLine;
};

describe('TextService', () => {
  let service: TextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(TextService);

    service.currentZoneDims = {width: 10, height: 10};
  });

  it('#should create', () => {
    expect(service).toBeTruthy();
  });

  it('#getTextAlign should return the correct values', () => {
    const expectations = new Map([
      [TextAlignement.left, 0],
      [TextAlignement.center, 5],
      [TextAlignement.right, 10]
    ]);

    expectations.forEach((val, key) => {
      service.textAlignement = key;
      expect(service.getTextAlign()).toEqual(val);
    });
  });

  it('#getTextAnchor should return the correct values', () => {
    const expectations = new Map([
      [TextAlignement.left, 'start'],
      [TextAlignement.center, 'middle'],
      [TextAlignement.right, 'end']
    ]);

    expectations.forEach((val, key) => {
      service.textAlignement = key;
      expect(service.getTextAnchor()).toEqual(val);
    });
  });

  it('#getFullTextWidth should call getLineWidth for a non empty line', () => {
    const line = createLine('drawit');
    const spy = spyOn(service, 'getLineWidth');
    service.getFullTextWidth(line);
    expect(spy).toHaveBeenCalled();
  });

  it('#getFullTextWidth should call getLineWidth for an empty line', () => {
    const line = createLine('');
    const spy = spyOn(service, 'getLineWidth');
    service.getFullTextWidth(line);
    expect(spy).toHaveBeenCalled();
  });

  it('#getLineWidth should call getComputedTextLength for the line if a non empty line is passed', () => {
    const line = createLine('drawit');
    const spy = spyOn((line.tspan as SVGTextContentElement), 'getComputedTextLength');
    service.getLineWidth(line);
    expect(spy).toHaveBeenCalled();
  });

  it('#getLineWidth should call getComputedTextLength for the line if an empty line is passed', () => {
    const line = createLine('drawit');
    line.tspan.textContent = undefined as unknown as string;
    const spy = spyOn((line.tspan as SVGTextContentElement), 'getComputedTextLength');
    service.getLineWidth(line);
    expect(spy).toHaveBeenCalled();
  });

});
