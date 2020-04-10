import {Renderer2} from '@angular/core';
import {fakeAsync, tick} from '@angular/core/testing';
import {Point} from '../../shape/common/point';
import {TextService} from '../text.service';
import {Cursor} from './cursor';
import {TextAlignement} from './text-alignement';
import {TextLine} from './text-line';

// // tslint:disable:no-magic-numbers no-string-literal no-any
// describe('Cursor', () => {
//   let cursor: Cursor;
//   let setAttributeWasCalled: boolean;
//   let removeWasCalled: boolean;

//   const renderer = {
//     setAttribute: ( element: SVGElement, attribute: string, value: string ) => {
//       element.setAttribute( attribute, value);
//     }
//   } as unknown as Renderer2;

//   beforeEach(() => {
//     const element = {
//       remove: () => removeWasCalled = true,
//       setAttribute: () => setAttributeWasCalled = true,
//     } as unknown as SVGElement;

//     setAttributeWasCalled = false;
//     removeWasCalled = false;

//     cursor = new Cursor(renderer, new TextService(), element, new Point(42, 69));
//   });

//   it('#should create', () => {
//     expect(cursor).toBeTruthy();
//   });

//   it(' #initBlink should subscribe the frequency to the blink method', fakeAsync(() => {
//     const spy = spyOn<any>(cursor, 'blink');
//     cursor.initBlink();
//     setTimeout(
//       () => {
//         expect(spy).toHaveBeenCalledTimes(2);
//         cursor.stopBlink();
//       },
//       1020
//     );
//     tick(1020);
//   }));

//   it('#removeCursor should have called the remove method of the element', () => {
//     cursor.removeCursor();
//     expect(removeWasCalled).toBeTruthy();
//   });

//   it('#updateVisual should call setAttribute', () => {
//     cursor['updateVisual']();
//     expect(setAttributeWasCalled).toBeTruthy();
//   });

//   it('#blink should call setAttribute and invert the visible boolean (false)', () => {
//     const spy = spyOn(cursor['renderer'], 'setAttribute').and.callThrough();
//     cursor['visible'] = false;
//     const oldVisible = cursor['visible'];
//     cursor['blink']();
//     expect(cursor['visible']).not.toEqual(oldVisible);
//     expect(setAttributeWasCalled).toBeTruthy();
//     expect(spy).toHaveBeenCalled();
//   });

//   it('#blink should call setAttribute and invert the visible boolean (true)', () => {
//     const spy = spyOn(cursor['renderer'], 'setAttribute').and.callThrough();
//     cursor['visible'] = true;
//     const oldVisible = cursor['visible'];
//     cursor['blink']();
//     expect(cursor['visible']).not.toEqual(oldVisible);
//     expect(setAttributeWasCalled).toBeTruthy();
//     expect(spy).toHaveBeenCalled();
//   });

//   it('#move should call getLineWidth for every alignement type', () => {
//     const alignements = ['left', 'center', 'right'];

//     const spy = spyOn(cursor['service'], 'getLineWidth');
//     spyOn(cursor['service'], 'getFullTextWidth');
//     spyOn(cursor['service'], 'getTextAlign');

// alignements.forEach((align) => {
//       cursor['service'].textAlignement = align as TextAlignement;
//       cursor.move(
//         {tspan: undefined as unknown as SVGElement, letters: [], cursorIndex: 0} as unknown as TextLine,
//         0
//       );
//     });
//     expect(spy).toHaveBeenCalledTimes(3);
//   });

// });
