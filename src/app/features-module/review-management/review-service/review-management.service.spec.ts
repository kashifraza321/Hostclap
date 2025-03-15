import { TestBed } from '@angular/core/testing';

import { ReviewManagementService } from './review-management.service';

describe('ReviewManagementService', () => {
  let service: ReviewManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
