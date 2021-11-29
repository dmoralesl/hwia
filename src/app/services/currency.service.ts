import { BehaviorSubject, Observable } from 'rxjs';

import { CacheService } from 'src/app/services/cache.service';
import { Currency } from '../models/Currency';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {

  currenciesList: Currency[] = [];

  // currencySelected: BehaviorSubject<Currency> = new BehaviorSubject({
  //   name: 'United States Dollar',
  //   displayName: '$ (UDS)',
  //   symbol: '$',
  //   id: 'USD'
  // });

  currencySelected: BehaviorSubject<Currency> = new BehaviorSubject({} as Currency);

  currencyFactor: BehaviorSubject<number> = new BehaviorSubject(1);

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
    ) {}

  public setCurrenciesList(): Promise<Currency[]> {
    return new Promise((resolve, reject) => {
        this.cacheService.getItem('currenciesList')
          .then(currenciesList => this.currenciesList = currenciesList as Currency[])
          .catch(error => {
            this.http.get(`${environment.currencyUrl}currencies`, {
              params: {
                apiKey: environment.currencyApiKey
              }
            }).subscribe((data: any) => {
              this.currenciesList = Object.values(data.results).map((currency: any) => {
                return ({
                  name: currency.currencyName,
                  displayName: currency.currencySymbol ? `${currency.currencySymbol} (${currency.id})` : `(${currency.id})`,
                  symbol: currency.currencySymbol,
                  id: currency.id
                });
              });
              this.cacheService.setItem('currenciesList', this.currenciesList);
            });
          })
          .finally(() => {
            this.changeCurrency(this.currenciesList.filter(currency => currency.id === environment.DEFAULT_CURRENCY)[0]);
            resolve(this.currenciesList);
          });
        });
  }

  public getCurrentCurrency(): Observable<Currency> {
    return this.currencySelected;
  }

  public changeCurrency(currency: Currency): void {
    this.currencySelected.next(currency);
    this.getCurrencyFactor(currency.id).subscribe(factor => {
      console.warn(currency, factor, Object.values(factor)[0]);
      this.currencyFactor.next(Object.values(factor)[0]);
    })
  }

  public getCurrencyFactor(currencyId: string): Observable<object> {
    return this.http.get(`${environment.currencyUrl}convert`, {
      params: {
        q:`USD_${currencyId}`,
        compact: 'ultra',
        apiKey: environment.currencyApiKey
      }
    })
  }

    
  
}
