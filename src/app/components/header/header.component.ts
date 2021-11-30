import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { Currency } from 'src/app/models/Currency';
import { CurrencyService } from 'src/app/services/currency.service';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { User } from '@firebase/auth';
import { _filterCurrencies } from 'src/app/helpers';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild(MatAutocompleteTrigger) autocomplete!: MatAutocompleteTrigger;
  openAutocomplete() { this.autocomplete.openPanel(); }
  
  displayHeader: boolean = false; 
  isMobile: boolean = window.innerWidth <= 875;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 875;
  }
  
  currencySelected!: Currency;
  currenciesList: Currency[] = [];
  
  currenciesControl: FormControl = new FormControl();

  filteredCurrenciesOptions!: Observable<Currency[]>;

  user!: User | null;

  constructor(
    private currecyService: CurrencyService,
    private authService: AuthService,
    public router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    console.log(window.innerWidth, this.isMobile)
    this.authService.user.subscribe(user => {
        this.user = user;
    })

    this.currenciesList = await this.currecyService.setCurrenciesList();

    this.currecyService.getCurrentCurrency().subscribe(currency => {
      this.currencySelected = currency;
    });


    // Creating subscription to filter people when data is loaded
    this.filteredCurrenciesOptions = this.currenciesControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        let result: Currency[] = this.currenciesList;
        result =  _filterCurrencies(value, this.currenciesList);

        if (result.length === 1) { 
          this.changeCurrency(result[0]);
          if (result[0].displayName === this.currenciesControl.value) {
            result = this.currenciesList;
          }
        }
        return result;
      })
    );

    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd && this.displayHeader && this.isMobile) {
        this.displayHeader = false;
      }
    });
  }
  

  changeCurrency(currency: Currency) {
    this.currecyService.changeCurrency(currency);
    this.displayHeader = false;
  }

  signOut(): void {
    this.authService.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.log(error);
      });
  }

  toggleMenu(): void {
    this.displayHeader = !this.displayHeader;
  }
}
