import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, flush, tick, waitForAsync } from '@angular/core/testing';

import { AuthService } from 'src/app/services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Currency } from './../../models/Currency';
import { DataService } from 'src/app/services/data.service';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { environment } from './../../../environments/environment';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const spyAuth = jasmine.createSpyObj('AuthService', [], {'user':{value:'mail@mail.com'}});

  const spyData = jasmine.createSpyObj('DataService', ['getCollectionFiltered', 'getCollection']);
  const fakeCollectionResponse = [{
    name: 'Elon Musk',
    doc: {
      id: '1',
      data: () => ({name: 'Elon Musk', id: '1'}),
      }
    },
    {
    name: 'name2',
    doc: {
      id: '2',
      data: () => ({name: 'name2', id: '2'}),
      }
    }]
  spyData.getCollectionFiltered.and.returnValue(of(fakeCollectionResponse));
  spyData.getCollection.and.returnValue(of(fakeCollectionResponse));

  const spyCache = jasmine.createSpyObj('CacheService', ['getItem', 'setItem']);
  const spyCurrency = jasmine.createSpyObj('CurrencyService', [], {'currencySelected': {} as Currency, 'currencyFactor': 1});


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [ HttpClientTestingModule, MatAutocompleteModule ],
      providers: [
        {provide: AuthService, useValue: spyAuth },
        {provide: DataService, useValue: spyData }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    sessionStorage.clear();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear formControl currency input', () => {
    component.activitiesControl.setValue('test');

    expect(component.activitiesControl.value).toBe('test');

    component.clearInput(component.activitiesControl);
    
    expect(component.activitiesControl.value).toBe('');
  });

  it('should call interval() function and set new item in sessionStorage', fakeAsync(() => {

    component.ngOnInit();
    tick(environment.TIMER_UPDATE_INTERVAL * 2);
    expect(component.sessionTime).toBe(environment.TIMER_UPDATE_INTERVAL / 1000);
    discardPeriodicTasks()
  }));

  it('should call interval() function and update item in sessionStorage', fakeAsync(() => {

    component.ngOnInit();
    const strPreviousTime = sessionStorage.getItem('timeSession');
    const previousTime = strPreviousTime ? parseInt(strPreviousTime) : 0;
    tick(environment.TIMER_UPDATE_INTERVAL * 2);
    expect(component.sessionTime).toBe(previousTime + (environment.TIMER_UPDATE_INTERVAL / 1000));
    discardPeriodicTasks()
  }));


  it('should apply filter in people options in select dropdown', fakeAsync(() => {
    
    component.ngOnInit();
    tick();
    discardPeriodicTasks();
    let firstCall = true;
    component.filteredPeopleOptions?.subscribe(res => { 
      if (firstCall) { // avoiding default startWith('')
        firstCall = false;
      } else {
        expect(res.length).toBe(1);
      }

    });
    component.peopleControl.setValue('2');

    expect(component.peopleControl.value).toBe('2');

  }));


  it('should apply filter in people options in select dropdown with object as value', fakeAsync(() => {
    
    component.ngOnInit();
    tick();
    discardPeriodicTasks();
    let firstCall = true;
    component.filteredPeopleOptions?.subscribe(res => { 
      if (firstCall) { // avoiding default startWith('')
        firstCall = false;
      } else {
        expect(res.length).toBe(1);
      }
    });
    component.peopleControl.setValue({name: '2'});

    
  }));

  it('should apply filter in activities options in select dropdown', fakeAsync(() => {

    let callNumber: number = 0;

    
    component.ngOnInit();
    tick()
    discardPeriodicTasks();

    component.filteredActivitiesOptions?.subscribe(res => { 
      if (callNumber < 3) { // avoiding default startWith('')
        callNumber++;
      } else {
        expect(res.length).toBe(1);
      }
    });
    component.activitiesControl.setValue('2');
    expect(component.activitiesControl.value).toBe('2');

  }));

  it('should apply filter in activities options in select dropdown with object as value', fakeAsync(() => {

    const valueToTest = {name: '2'};
    
    component.ngOnInit();
    tick()
    discardPeriodicTasks();

    component.filteredActivitiesOptions?.subscribe(res => { 
      if (res[0].name.includes(valueToTest.name)) { // avoiding default startWith('')
        expect(res.length).toBe(1);
      }
    });
    component.activitiesControl.setValue(valueToTest);

  }));

});
