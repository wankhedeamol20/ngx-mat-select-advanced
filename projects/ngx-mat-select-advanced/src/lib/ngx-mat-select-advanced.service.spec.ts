import { TestBed } from '@angular/core/testing';

import { NgxMatSelectAdvancedService } from './ngx-mat-select-advanced.service';

describe('NgxMatSelectAdvancedService', () => {
  let service: NgxMatSelectAdvancedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxMatSelectAdvancedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
