import { TestBed } from '@angular/core/testing';

import { ColorService } from './color.service';

fdescribe('ColorService', () => {

  let service: ColorService;

  const initialiseArray = () => {
    service.recentColors = ['rgba(1, 1, 1, 1)', 'rgba(2, 2, 2, 1)', 'rgba(3, 3, 3, 1)', 'rgba(4, 4, 4, 1)', 'rgba(5, 5, 5, 1)',
                            'rgba(6, 6, 6, 1)', 'rgba(7, 7, 7, 1)', 'rgba(8, 8, 8, 1)', 'rgba(9, 9, 9, 1)', 'rgba(0, 0, 0, 1)'];
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ColorService);;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#method rgbToHex()', () => {
    expect(service.rgbToHex({
      r : 200,
      g : 127,
      b : 0
    })).toBe('C87F00');
  });

  it('#method hexToRgb()', () => {
    // Everything ok
    expect(service.hexToRgb('#C87F00')).toEqual({
      r : 200,
      g : 127,
      b : 0
    });
    // Parse error
    expect(service.hexToRgb('#C8F00')).toEqual({
      r : -1,
      g : -1,
      b : -1
    });
  });

  it('#method rgbFormRgba()', () => {
    // Everything ok
    expect(service.rgbFormRgba('rgba(200, 127, 0, 0.1111)')).toEqual({
      r : 200,
      g : 127,
      b : 0
    });
    // String parse error
    expect(service.rgbFormRgba('rgba(256 127, 0, 1)')).toEqual({
      r : -1,
      g : -1,
      b : -1
    });
  });

  it('#method rgbFormRgba()', () => {
    expect(service.hexFormRgba('rgba(200, 127, 0, 1)')).toEqual('#C87F00');
  });

  it('#method pushColor()', () => {
    initialiseArray();
    service.pushColor('rgba(8, 8, 8, 1)');
    expect(service.recentColors[0]).toEqual('rgba(8, 8, 8, 1)');
    expect(service.recentColors[9]).toEqual('rgba(0, 0, 0, 1)');

    initialiseArray();
    service.pushColor('rgba(8, 8, 8, 0.1)');
    expect(service.recentColors[0]).toEqual('rgba(8, 8, 8, 1)');
    expect(service.recentColors[9]).toEqual('rgba(0, 0, 0, 1)');

    initialiseArray();
    service.pushColor('rgba(10, 10, 10, 0.1111)');
    expect(service.recentColors[0]).toEqual('rgba(10, 10, 10, 0.1111)');
    expect(service.recentColors[9]).toEqual('rgba(9, 9, 9, 1)');
  });

  it('#method selectPrimaryColor()', () => {
    initialiseArray();
    service.selectPrimaryColor('rgba(8, 8, 8, 1)');
    expect(service.recentColors[0]).toEqual('rgba(8, 8, 8, 1)');
    expect(service.primaryColor).toEqual('rgba(8, 8, 8, 1)');
  });

  it('#method selectSecondaryColor()', () => {
    initialiseArray();
    service.selectSecondaryColor('rgba(8, 8, 8, 1)');
    expect(service.recentColors[0]).toEqual('rgba(8, 8, 8, 1)');
    expect(service.secondaryColor).toEqual('rgba(8, 8, 8, 1)');
  });

});
