import { TestBed } from '@angular/core/testing';

import { SvgService } from './svg.service';

describe('SvgService', () => {
  let service: SvgService;

  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    service = TestBed.get(SvgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO

  // it('#changeBackgroundColor() should change svg background color', () => {
  //   service.changeBackgroundColor('rgb(171, 205, 239)');
  //   const color = service.instance.nativeElement.style.backgroundColor;
  //   expect(color).toEqual('rgb(171, 205, 239)');
  // });

});
