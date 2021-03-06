import { Renderer2 } from '@angular/core';
import { Point } from '../../tool/shape/common/point';
import { Transform } from './transform';

// tslint:disable: no-magic-numbers
describe('Transform', () => {

  const renderer = {
    setAttribute: ( element: SVGElement, attribute: string, value: string ) => {
      element.setAttribute( attribute, value);
    }
  } as unknown as Renderer2;

  let svg: SVGSVGElement;
  let rect: SVGElement;

  beforeEach(() => {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '500';
    svg.style.height = '500';
    svg.style.backgroundColor = '#FFFFFF';
    rect = document.createElementNS('http://www.w3.org/2000/svg', 'svg:rect');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '0');
    rect.setAttribute('width', '200');
    rect.setAttribute('height', '200');
    rect.setAttribute('fill', 'rgba(255, 0, 0, 1)');
    svg.appendChild(rect);
    document.body.appendChild(svg);
  });

  afterEach(() => {
    svg.remove();
  });

  it('#getTransformTranslate should return translate field', () => {
    expect(new Transform(rect, renderer).getTransformTranslate())
      .toEqual([0, 0]);
  });

  it('#translate can translate element', () => {
    new Transform(rect, renderer).translate(-10, 2);
    expect(new Transform(rect, renderer).getTransformTranslate())
      .toEqual([-10, 2]);
    new Transform(rect, renderer).translate(-10, 2);
    expect(new Transform(rect, renderer).getTransformTranslate())
      .toEqual([-20, 4]);
  });

  it('#translateAll can translate a set of elements', () => {
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

  it('#rotateAll action should be reversible', () => {
    const center = svg.createSVGPoint();
    center.x = 100;
    center.y = 100;
    Transform.rotateAll([rect], new Point(0, 0), 90, renderer);
    Transform.rotateAll([rect], new Point(0, 0), -90, renderer);
    expect(rect.getAttribute('transform')).toEqual('matrix(1,0,0,1,0,0)');
  });

  it('#scale can scale elements', () => {
    const center = svg.createSVGPoint();
    center.x = 100;
    center.y = 100;
    new Transform(rect, renderer).scale(new Point(100, 100), 2, 2);
    const boundingRect = rect.getBoundingClientRect();
    expect(boundingRect.width).toEqual(400);
    expect(boundingRect.height).toEqual(400);
  });

  it('#scaleAll scale each element', () => {
    const nElement = 5;
    const elements = new Array(nElement);
    for (let index = 0; index < nElement; index++) {
      elements[index] = rect.cloneNode(true);
      svg.appendChild(elements[index]);
    }
    Transform.scaleAll(elements, new Point(100, 100), 2, 2, renderer);
    for (let index = 0; index < nElement; index++) {
      const boundingRect = elements[index].getBoundingClientRect();
      expect(boundingRect.width).toEqual(400);
      expect(boundingRect.height).toEqual(400);
    }
  });

});
