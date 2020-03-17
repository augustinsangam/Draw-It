import { TestBed } from '@angular/core/testing';

import { SvgToCanvasService } from './svg-to-canvas.service';

describe('SvgToCanvasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('#should be created', () => {
    const service: SvgToCanvasService = TestBed.get(SvgToCanvasService);
    expect(service).toBeTruthy();
  });
});
