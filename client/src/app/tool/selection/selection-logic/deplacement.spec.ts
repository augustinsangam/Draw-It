import { Deplacement } from './deplacement';

// TODO : Ask the chargé de lab
// tslint:disable: no-magic-numbers
describe('DeplacementUtil', () => {

  it('#getTransformTranslate works well', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg', 'svg:rect');
    expect(Deplacement.getTransformTranslate(element))
      .toEqual([0, 0]);
  });

  it('#translate works well', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg', 'svg:rect');
    Deplacement.translate(element, -10, 2);
    expect(Deplacement.getTransformTranslate(element))
      .toEqual([-10, 2]);
    Deplacement.translate(element, -10, 2);
    expect(Deplacement.getTransformTranslate(element))
      .toEqual([-20, 4]);
  });

  it('#translateAll works well', () => {
    const nElement = 5;
    const elements = new Array(nElement);
    for (let index = 0; index < nElement; index++) {
      elements[index] = document.createElementNS(
        'http://www.w3.org/2000/svg', 'svg:rect');
    }
    Deplacement.translateAll(elements, -10, 2);
    for (let index = 0; index < nElement; index++) {
      expect(Deplacement.getTransformTranslate(elements[index]))
      .toEqual([-10, 2]);
    }
  });

});
