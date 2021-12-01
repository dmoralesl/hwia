import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from 'src/app/services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const spy = jasmine.createSpyObj('AuthService', ['login']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ RouterTestingModule ],
      providers: [{provide: AuthService, useValue: spy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login and get resolved promise', () => {
    spy.login.and.returnValue(Promise.resolve());
  
    component.login();
    expect(spy.login).toHaveBeenCalled();
  });

  it('should call login and get rejected promise', () => {
    spy.login.and.returnValue(Promise.reject());
  
    component.login();
    expect(spy.login).toHaveBeenCalled();
  });
});
