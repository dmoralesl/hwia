import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Activity } from './../../models/Activity';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { FirebaseFilter } from 'src/app/models/Firebase';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  customActivities: Activity[] = [];
 
  activityForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    time: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
  });

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) { }


  ngOnInit(): void {
    const filterByUser: FirebaseFilter = {
      fieldPath: 'createdBy',
      operator: '==',
      value: this.authService.user.getValue()?.email || ""
    };
    this.dataService.getCollectionFiltered('tasks', [filterByUser]).subscribe(data => {

      data.map(activity => {
        if (activity.type === 'added') {
          this.customActivities.push( {id: activity.doc.id, ...activity.doc.data() } as Activity );
        } else if (activity.type === 'removed') {
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
