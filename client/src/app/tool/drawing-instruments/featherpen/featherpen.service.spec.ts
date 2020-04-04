import { TestBed } from '@angular/core/testing';

import {Point} from '../../shape/common/point';
import { FeatherpenService } from './featherpen.service';

// tslint:disable:no-string-literal no-magic-numbers
fdescribe('FeatherpenService', () => {
  let service: FeatherpenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(FeatherpenService);
  });

  it('#should create', () => {
    expect(service).toBeTruthy();
  });

  it('#pathCentered shouéd return a non empty string', () => {
    expect(service.pathCentered(new Point(42, 69))).not.toEqual('');
  });

  it('#toRadians should return the expected value', () => {
    expect(service['toRadians'](180)).toEqual(Math.PI);
  });

  it('#udpateAngle should increment the angle value of 15 if alt is not pressed (scrollup)', () => {
    service['angle'] = 0;
    service.updateAngle(new WheelEvent('wheel', {deltaY: -1, altKey: false}));
    expect(service['angle']).toEqual(15);
  });

  it('#udpateAngle should increment the angle value of 1 if alt is pressed (scrollup)', () => {
    service['angle'] = 0;
    service.updateAngle(new WheelEvent('wheel', {deltaY: -1, altKey: true}));
    expect(service['angle']).toEqual(1);
  });

  it('#udpateAngle should decrement the angle value of 1 if alt is not pressed (scrolldown)', () => {
    service['angle'] = 10;
    service.updateAngle(new WheelEvent('wheel', {deltaY: 1, altKey: false}));
    expect(service['angle']).toEqual(175);
  });

  it('#udpateAngle should decrement the angle value of 1 if alt is pressed (scrolldown)', () => {
    service['angle'] = 15;
    service.updateAngle(new WheelEvent('wheel', {deltaY: 1, altKey: true}));
    expect(service['angle']).toEqual(14);
  });

  // The following tested method aims at selecting parts of an array. 4 cases are possible, so these 4 tests
  // simulate them. The 4 cases (the selection is indicated between pipes `|` :

  // case A                            |        case B
  // [ - - - - - - - - - - - ]         |        [ - - - - - - - - - - - ]
  //    |---------------->|            |         ---->|            |--->
  //  ____________________________________________________________________
  //                                   |
  // case C                            |        case D
  // [ - - - - - - - - - - - ]         |        [ - - - - - - - - - - - ]
  //     |<-------------|              |         <----|           |<----

  it('#interpolate should return a non empty path and handle case A', () => {
    expect(service.interpolate(12, 21, new Point(42, 69), true)).not.toEqual('');
  });

  it('#interpolate should return a non empty path and handle case B', () => {
    expect(service.interpolate(175, 10, new Point(42, 69), true)).not.toEqual('');
  });

  it('#interpolate should return a non empty path and handle case C', () => {
    expect(service.interpolate(45, 30, new Point(42, 69), false)).not.toEqual('');
  });

  it('#interpolate should return a non empty path and handle case D', () => {
    expect(service.interpolate(10, 175, new Point(42, 69), false)).not.toEqual('');
  });
});
