import { Component, OnInit } from '@angular/core';

import { DataService } from 'src/app/services/data.service';
import { People } from 'src/app/models/People';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  people: People[] = []; 

  constructor (
    private dataService: DataService,
  ) {}

  ngOnInit() {
    console.log('AppComponent.ngOnInit');
    this.dataService.getCollection('people').subscribe(data => {;
      this.people = data;
      console.log('data', this.people);
    })
  }
  
}
