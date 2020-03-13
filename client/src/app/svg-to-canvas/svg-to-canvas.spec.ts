import { TestBed } from '@angular/core/testing';

import { SvgToCanvas } from './svg-to-canvas';

describe('SvgToCanvasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SvgToCanvasService = TestBed.get(SvgToCanvasService);
    expect(service).toBeTruthy();
  });
});
