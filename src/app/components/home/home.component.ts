import { Component, OnInit } from '@angular/core';
import { Observable, interval, map, of, startWith, tap } from 'rxjs';
import { _filter, calculateMoneySince, getMoneyPerSecond } from 'src/app/helpers';

import { Activity } from 'src/app/models/Activity';
import { CacheService } from 'src/app/services/cache.service';
import { Currency } from './../../models/Currency';
import { CurrencyService } from './../../services/currency.service';
import { DataService } from 'src/app/services/data.service';
import { FormControl } from '@angular/forms';
import { People } from 'src/app/models/People';

const TIMER_UPDATE_INTERVAL = 3000;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  peopleControl = new FormControl();
  activitiesControl = new FormControl();
  
  people: People[] = []; 
  activities: Activity[] = [];
  
  filteredPeopleOptions: Observable<People[]> | undefined;
  filteredActivitiesOptions: Observable<Activity[]> | undefined;

  selectedPeople!: People;
  selectedActivity!: Activity;

  moneyPerSecond: number = 0;
  sessionTime: number = 0;
  calculateMoneySince = calculateMoneySince;
  currencyFactor: number = 1;
  currencySelected!: Currency;
  moneyWon: number = 0;

  constructor (
    private dataService: DataService,
    private currencyService: CurrencyService,
    private cacheService: CacheService
  ) {  }

  async ngOnInit() {
    this.currencyService.currencySelected.subscribe(currency => this.currencySelected = currency);
    this.currencyService.currencyFactor.subscribe(factor => {
      this.currencyFactor = factor; 
      this.refreshMoneyPerSecond();
    });

    // Caching people data because is static and uses a lot of free tier of Firebase
    try {
      this.people = await this.cacheService.getItem('people') as People[];
    } catch (error) {
        this.dataService.getCollection('people').subscribe(data => {
          this.people = data;
          this.cacheService.setItem('people', data);
      });
    };


    // Creating subscription to filter people when data is loaded
    this.filteredPeopleOptions = this.peopleControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(value => _filter(value, this.people)),
      tap((optionsList) => {
        if (optionsList.length === 1) { 
          this.selectedPeople = optionsList[0];
          this.refreshMoneyPerSecond();
        }
      })
    );


    this.dataService.getCollection('tasks').subscribe(data => {
      this.activities = data;
      this.activitiesControl.setValue(data[0].name);
      this.selectedActivity = data[0];
      this.selectedPeople = this.people[0];
      this.peopleControl.setValue(this.people[0].name);
  
      this.refreshMoneyPerSecond();
      // Creating subscription to filter activities when data is loaded
      this.filteredActivitiesOptions = this.activitiesControl.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value.name)),
        map(value => _filter(value, this.activities)),
        tap((optionsList) => {
          if (optionsList.length === 1) { 
            this.selectedActivity = optionsList[0];
            this.refreshMoneyPerSecond();
          }
        })
      );
    });
    
    // Repeating check of time session
    interval(TIMER_UPDATE_INTERVAL).subscribe(() => {
      const currentTime = window.sessionStorage.getItem('timeSession');
      if (currentTime) {
        const newSessionTime = parseInt(currentTime) + (TIMER_UPDATE_INTERVAL/1000)
        window.sessionStorage.setItem('timeSession', (newSessionTime.toString()));
        this.sessionTime = newSessionTime;
      } else {
        window.sessionStorage.setItem('timeSession', '0');
      }
    });
  }
  
  refreshMoneyPerSecond() {
    console.log('refresigh')
    this.moneyPerSecond = getMoneyPerSecond(this.selectedPeople?.income);
    console.log(this.selectedPeople, this.selectedActivity, this.currencyFactor, getMoneyPerSecond(this.selectedPeople?.income), this.currencySelected)
    this.moneyWon = calculateMoneySince(this.moneyPerSecond, (this.selectedActivity.time * 60) , this.currencyFactor)
  }
  

}
