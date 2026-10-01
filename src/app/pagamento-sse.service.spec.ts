import { TestBed } from '@angular/core/testing';

import { PagamentoSseService } from './pagamento-sse.service';

describe('PagamentoSseService', () => {
  let service: PagamentoSseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagamentoSseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
