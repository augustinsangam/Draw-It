import { TestBed } from '@angular/core/testing';

import { ToolSelectorService } from './tool-selector.service';

describe('ToolSelectorService', () => {
  let service: ToolSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToolSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
