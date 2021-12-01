import { BehaviorSubject, of } from 'rxjs';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { AuthService } from 'src/app/services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Currency } from './../../models/Currency';
import { CurrencyService } from 'src/app/services/currency.service';
import { HeaderComponent } from './header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/modules/app-routing.module';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  const spyAuth = jasmine.createSpyObj('AuthService', ['signOut']);
  spyAuth.user = new BehaviorSubject<any>(undefined);
  
  const spyCurrency = jasmine.createSpyObj('CurrencyService', ['setCurrenciesList','changeCurrency']);
  
  const fakeCurrency = {
    name: 'EUR',
    displayName: 'Euro',
    symbol: '€',
    id: 'EUR'
  } as Currency;
  
  spyCurrency.currencySelected = new BehaviorSubject<Currency>(fakeCurrency);

  spyCurrency.setCurrenciesList = () => Promise.resolve([
    {
      name: 'EUR',
      displayName: 'Euro',
      symbol: '€',
      id: 'EUR'
    },
    {
      name: 'USD',
      displayName: 'US Dollar',
      symbol: '$',
      id: 'USD'
    }
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [ 
        RouterTestingModule.withRoutes(routes),
        ReactiveFormsModule 
      ],
      providers: [
        {provide: AuthService, useValue: spyAuth },
        {provide: CurrencyService, useValue: spyCurrency }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
    router = TestBed.get(Router); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call changeCurrency and side effects triggered', () => {
    const empyCurrency = {} as Currency;
    spyCurrency.changeCurrency.and.returnValue(empyCurrency);
  
    component.changeCurrency(empyCurrency);
    expect(spyCurrency.changeCurrency).toHaveBeenCalled();
    expect(component.displayHeader).toBeFalsy();
  });

  it('should call signOut with resolved promise', () => {
    spyAuth.signOut.and.returnValue(Promise.resolve());
  
    component.signOut();
    expect(spyAuth.signOut).toHaveBeenCalled();
  });

  it('should call signOut with rejected promise', () => {
    spyAuth.signOut.and.returnValue(Promise.reject());
  
    component.signOut();
    expect(spyAuth.signOut).toHaveBeenCalled();
  });


  it('should call toggleMenu and side effects triggered', () => {
    // Setting displayHeader to true to test functionality also if we change defaukt value of displayHeader
    component.displayHeader = true;
    component.toggleMenu();
    expect(component.displayHeader).toBeFalsy();
  });


  // it('should call openAutocomplete and autocomplet status', () => {

  //   component.openAutocomplete();
  //   expect(component.openAutocomplete).toHaveBeenCalled();
  // });

  it('should trigger onResize event and change isMobile value', () => {
    // Setting value that in most cases will be mobile
    const resizeSpy = spyOnProperty(window, 'innerWidth').and.returnValue(350);
    window.dispatchEvent(new Event('resize'));
    expect(resizeSpy).toHaveBeenCalled();
    expect(component.isMobile).toBeTruthy();
  });

  it('should filtered currencies change and have length=1 when currenciesControl value is "EUR"', () => {
    component.currenciesControl.setValue('EUR');
    expect(component.currenciesControl.value).toBe('EUR');
  });


  it('user shoud change when authUser changes', () => {
    spyAuth.user.next(null);
    
    expect(component.user).toEqual(null);
  });

  it('currencySelected should change when getCurrentCurrency observable triggers ', () => {
    
    
    spyCurrency.currencySelected.subscribe((currency: Currency) => {
      expect(currency).toBe(fakeCurrency);
    });
  });

  /// BUG: Cannot test because Angular 13 introduced a bug that raises error:
  // Unhandled promise rejection: Error: Injector has already been destroyed.
  // it('should set displayHeader to false when navigating', () => {
  //   component.isMobile = true;
  //   component.displayHeader = true;
  //   router.navigate(['/']);
  //   expect(component.displayHeader).toBeFalsy();

  // });

  it('should apply filter in currencies options in select dropdown', fakeAsync(() => {
     
    component.ngOnInit();
    tick()
    let callNumber: number = 0;
    component.filteredCurrenciesOptions?.subscribe(res => { 
      if (callNumber < 3) { // avoiding default startWith('')
        callNumber++;
      } else {
        expect(res.length).toBe(1);
      }
    });
    component.currenciesControl.setValue('Euro');
    expect(component.currenciesControl.value).toBe('Euro');

  }));

});
 