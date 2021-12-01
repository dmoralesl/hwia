import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Activity } from 'src/app/models/Activity';
import { AuthService } from 'src/app/services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DataService } from 'src/app/services/data.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const spyAuth = jasmine.createSpyObj('AuthService', [], {'user':{value:'mail@mail.com'}});


  const spyData = jasmine.createSpyObj('DataService', ['getCollectionFiltered', 'removeDocument', 'addDocument']);
  spyData.getCollectionFiltered.and.returnValue(of([{
    type: 'added',
    doc: {
      id: '1',
      data: () => [],
      }
    },
    {
    type: 'removed',
    doc: {
      id: '2',
      data: () => [],
      }
    }]
  ));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        {provide: AuthService, useValue: spyAuth },
        {provide: DataService, useValue: spyData }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call remove activity and not perform action because no id on activity object', () => {
    spyData.removeDocument.and.returnValue(Promise.resolve());
  
    component.removeActivity({} as Activity);
    expect(spyData.removeDocument).not.toHaveBeenCalled();
  });


  it('should call remove activity and perform action', () => {
    spyData.removeDocument.and.returnValue(Promise.resolve());
  
    component.removeActivity({id: 'randomId'} as Activity);
    expect(spyData.removeDocument).toHaveBeenCalled();
  });

  it('should call add activity', () => {
    spyData.addDocument.and.returnValue(Promise.resolve());
    component.activityForm.setValue({
      name: 'activity test',
      time: 1
    });

    component.addActivity();
    expect(spyData.addDocument).toHaveBeenCalled();
  });

  it('should push activity with type added on ngOninit', () => {
    // With this test we check bot branches inside ngOnInit.
    // We have an activity with type added and from original response of mocked service is adding to the array.
    // But the other activity has delete and not being added. So we have a customActivities with 0 length 
    // at start and then we obtain 2 activities from service but only one is pushed.
    expect(component.customActivities.length).toBe(1);
  });

});
