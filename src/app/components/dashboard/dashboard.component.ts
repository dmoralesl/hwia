import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Activity } from './../../models/Activity';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  customActivities: Activity[] = [];
 
  
  // customActivities: Activity[] = [
  //   {
  //     name: 'Activity 1 with a super long long long name',
  //     time: 1,
  //     category: 'category 1',
  //     createdBy: 'me',
  //     createdAt: new Date()
  //   },
  //   {
  //     name: 'Activity 2',
  //     time: 2,
  //     category: 'category 2',
  //     createdBy: 'me',
  //     createdAt: new Date()
  //   },
  //   {
  //     name: 'Activity 3',
  //     time: 3,
  //     category: 'category 3',
  //     createdBy: 'me',
  //     createdAt: new Date()
  //   },
  //   {
  //     name: 'Activity 4',
  //     time: 4, 
  //     category: 'category 4',
  //     createdBy: 'me',
  //     createdAt: new Date()
  //   },
  //   {
  //     name: 'Activity 5',
  //     time: 5,
  //     category: 'category 5',
  //     createdBy: 'me',
  //     createdAt: new Date()
  //   },
  //   {
  //     name: 'Activity 6',
  //     time: 6,
  //     category: 'category 6',
  //     createdBy: 'me',
  //     createdAt: new Date()
  //   },
  //   {
  //     name: 'Activity 7',
  //     time: 7,
  //     category: 'category 7',
  //     createdBy: 'me',
  //     createdAt: new Date()
  //   },
    
  // ];



  activityForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    time: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
  });

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) { }


  ngOnInit(): void {
    this.dataService.getCollectionFiltered('tasks', 'createdBy', this.authService.user.getValue()?.email || "", '==').subscribe(data => {

      data.map(activity => {
        if (activity.type === 'added') {
          this.customActivities.push( {id: activity.doc.id, ...activity.doc.data() } as Activity );
        } else if (activity.type === 'removed') {
          console.log(activity);
          this.customActivities = this.customActivities.filter(a => a.id !== activity.doc.id);
        }
      });
    })
  }

  removeActivity(activity: Activity): void {
    if (activity.id) {
      this.dataService.removeDocument('tasks', activity.id);
    }
  }

  addActivity() {
    const activity: Activity = {
      name: this.activityForm.get('name')?.value,
      time: this.activityForm.get('time')?.value,
      category: 'custom',
      createdBy: this.authService.user.getValue()?.email || "",
      createdAt: new Date()
    };

    this.dataService.addDocument('tasks', activity);
  }
}
