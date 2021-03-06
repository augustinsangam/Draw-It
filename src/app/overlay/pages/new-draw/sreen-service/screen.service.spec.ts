// tslint:disable: no-string-literal

import { fakeAsync, getTestBed, TestBed, tick } from '@angular/core/testing';
import { EventManager } from '@angular/platform-browser';

import { ScreenService } from './screen.service';

describe('ScreenService', () => {

  let service: ScreenService;

  beforeEach( () => {
    TestBed.configureTestingModule({
      providers: [EventManager]
    });
    service = getTestBed().get(ScreenService);
  });

  it('#should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getCurrentSize() should return current size minus left bar width',
    () => {
    const currentScreenSize = {
      width: innerWidth - ScreenService['SIDEBAR_WIDTH'],
      height: innerHeight
    };
    expect(currentScreenSize).toEqual(service.getCurrentSize());
  });

  it('#Should trigger onResize method when window is resized', fakeAsync(() => {
    const spy = spyOn(service, 'onResize').and.callThrough();
    window.dispatchEvent(new Event('resize'));
    // We wait a little bit to make sure that the event had been catched
    setTimeout(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    }, 2);
    // Advance the clock
    tick(2);
  }));

});
