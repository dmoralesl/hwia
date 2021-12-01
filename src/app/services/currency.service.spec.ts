import { Currency } from './../models/Currency';
import { CurrencyService } from './currency.service';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

describe('CurrencyService', () => {
  let service: CurrencyService;
  const mockCurrency: Currency = {
    name: 'EUR',
    displayName: 'Euro',
    symbol: '€',
    id: 'EUR'
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(CurrencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set currencies list from http request', async() => {
    
    expect((await service.setCurrenciesList()).length).toBeGreaterThan(0);
  });

  it('should set currencies list from cache', async() => {
    await service.setCurrenciesList();

    expect(sessionStorage.getItem('currenciesList')).toBeTruthy();
  });


  it('should change current currency', async() => {
    const prevCurrency: Currency = service.currencySelected.value;
    
    service.changeCurrency(mockCurrency);

    expect(service.currencySelected.value).not.toEqual(prevCurrency);
  });

  it('should change current currency factor', async() => {
    const prevFactor: number = service.currencyFactor.value;
    
    await service.changeCurrency(mockCurrency);
    
    expect(service.currencyFactor.value).not.toEqual(prevFactor);
  });


});
