import { Renderer2 } from '@angular/core';
import { Transform } from './transform';

// tslint:disable: no-magic-numbers
describe('DeplacementUtil', () => {

  const renderer = {
    setAttribute: ( element: SVGElement, attribute: string, value: string ) => {
      element.setAttribute( attribute, value);
    }
  } as unknown as Renderer2;

  // TODO : remove com

  // it('#getTransformTranslate works well', () => {
  //   const element = document.createElementNS(
  //     'http://www.w3.org/2000/svg', 'svg:rect');
  //   expect(Transform.getTransformTranslate(element))
  //     .toEqual([0, 0]);
  // });

  // it('#translate works well', () => {
  //   const element = document.createElementNS(
  //     'http://www.w3.org/2000/svg', 'svg:rect');
  //   Transform.translate(element, -10, 2, renderer);
  //   expect(Transform.getTransformTranslate(element))
  //     .toEqual([-10, 2]);
  //   Transform.translate(element, -10, 2, renderer);
  //   expect(Transform.getTransformTranslate(element))
  //     .toEqual([-20, 4]);
  // });

  // it('#translateAll works well', () => {
  //   const nElement = 5;
  //   const elements = new Array(nElement);
  //   for (let index = 0; index < nElement; index++) {
  //     elements[index] = document.createElementNS(
  //       'http://www.w3.org/2000/svg', 'svg:rect');
  //   }
  //   Transform.translateAll(elements, -10, 2, renderer);
  //   for (let index = 0; index < nElement; index++) {
  //     expect(Transform.getTransformTranslate(elements[index]))
  //     .toEqual([-10, 2]);
  //   }
  // });
  it('#getTransformTranslate works well', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg', 'svg:rect');
    expect(new Transform(element, renderer).getTransformTranslate())
      .toEqual([0, 0]);
  });

  it('#translate works well', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg', 'svg:rect');
    new Transform(element, renderer).translate(-10, 2);
    expect(new Transform(element, renderer).getTransformTranslate())
      .toEqual([-10, 2]);
    new Transform(element, renderer).translate(-10, 2);
    expect(new Transform(element, renderer).getTransformTranslate())
      .toEqual([-20, 4]);
  });

  it('#translateAll works well', () => {
    const nElement = 5;
    const elements = new Array(nElement);
    for (let index = 0; index < nElement; index++) {
      elements[index] = document.createElementNS(
        'http://www.w3.org/2000/svg', 'svg:rect');
    }
    Transform.translateAll(elements, -10, 2, renderer);
    for (let index = 0; index < nElement; index++) {
      expect(new Transform(elements[index], renderer).getTransformTranslate())
      .toEqual([-10, 2]);
    }
  });

});
