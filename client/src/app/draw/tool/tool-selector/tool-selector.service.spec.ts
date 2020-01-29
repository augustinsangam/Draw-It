import { TestBed } from '@angular/core/testing';

import { ToolSelectorService } from './tool-selector.service';

describe('ToolSelectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToolSelectorService = TestBed.get(ToolSelectorService);
    expect(service).toBeTruthy();
  });
});
