import { TestBed } from '@angular/core/testing';

import { SubadminService } from './subadmin.service';

describe('SubadminService', () => {
  let service: SubadminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubadminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
