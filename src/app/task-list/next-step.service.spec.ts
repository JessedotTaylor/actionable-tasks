/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NextStepService } from './next-step.service';

describe('Service: NextStep', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NextStepService]
    });
  });

  it('should ...', inject([NextStepService], (service: NextStepService) => {
    expect(service).toBeTruthy();
  }));
});
