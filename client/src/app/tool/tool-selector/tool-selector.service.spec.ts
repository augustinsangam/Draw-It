import { TestBed } from '@angular/core/testing';

import { Tool } from '../tool.enum';
import { callback, ToolSelectorService } from './tool-selector.service';

describe('ToolSelectorService', () => {

  let service: ToolSelectorService;

  beforeEach(() => TestBed.configureTestingModule({}));

  /* tslint:disable:no-string-literal */

  beforeEach(() => {
    service = TestBed.get(ToolSelectorService);
    service['onChangeCallbacks'][0] = (tool: Tool) => { return ; };
    service['onSameCallbacks'][0] = (tool: Tool) => { return ; };
  });

  it('#should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#Tool attribute should not change when the same tool is selected', () => {
    service['tool'] = Tool.BRUSH;
    service.set(Tool.BRUSH);
    expect(service['tool']).toEqual(Tool.BRUSH);
  });

  it('#Tool attribute should change when a different tool is selected', () => {
    service.set(Tool.BRUSH);
    expect(service['tool']).toEqual(Tool.BRUSH);
  });

  it('#onChange() should push argument in onChangeCallbacks', () => {
    const cb: callback = () => {return ; };
    service.onChange(cb);
    expect(service['onChangeCallbacks']).toContain(cb);
  });

  it('#onSame() should push argument in onSameCallbacks', () => {
    const cb: callback = () => { return ; };
    service.onSame(cb);
    expect(service['onSameCallbacks']).toContain(cb);
  });

});
