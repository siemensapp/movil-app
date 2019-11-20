import { TestBed } from '@angular/core/testing';

import { ComponentsCommsService } from './components-comms.service';

describe('ComponentsCommsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComponentsCommsService = TestBed.get(ComponentsCommsService);
    expect(service).toBeTruthy();
  });
});
