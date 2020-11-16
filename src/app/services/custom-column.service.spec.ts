import { TestBed } from '@angular/core/testing';

import { CustomColumnService } from './custom-column.service';

describe('CustomColumnService', () => {
  let service: CustomColumnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomColumnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
