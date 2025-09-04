import { TestBed } from '@angular/core/testing';

import { StateTreasuryConfigService } from './state-treasury-config-service.service';

describe('StateTreasuryConfigService', () => {
  let service: StateTreasuryConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateTreasuryConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
