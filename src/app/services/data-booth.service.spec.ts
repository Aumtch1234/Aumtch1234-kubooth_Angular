import { TestBed } from '@angular/core/testing';

import { DataBoothService } from './data-booth.service';

describe('DataBoothService', () => {
  let service: DataBoothService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataBoothService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
