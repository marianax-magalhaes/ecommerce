import { TestBed } from '@angular/core/testing';

import { PottershopFormService } from './pottershop-form.service';

describe('PottershopFormService', () => {
  let service: PottershopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PottershopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
