import { TestBed } from '@angular/core/testing';

import {Point} from '../../shape/common/point';
import { AerosolService } from './aerosol.service';

// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
fdescribe('AerosolService', () => {
  let service: AerosolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(AerosolService);
    }
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generatePoints should return a non empty string', () => {
    expect(service.generatePoints(new Point(42, 42))).not.toEqual('');
  });
});
