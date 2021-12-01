import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from 'src/app/services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  const spy = jasmine.createSpyObj('AuthService', ['createUser']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupComponent ],
      imports: [ RouterTestingModule ],
      providers: [{provide: AuthService, useValue: spy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createUser and get resolved promise', () => {
    spy.createUser.and.returnValue(Promise.resolve());
  
    component.createUser();
    expect(spy.createUser).toHaveBeenCalled();
  });

  it('should call createUser and get rejected promise', () => {
    spy.createUser.and.returnValue(Promise.reject());
  
    component.createUser();
    expect(spy.createUser).toHaveBeenCalled();
  });

  it('should signupForm being valid', () => {
    component.signupForm.setValue({
      email: 'valid@mail.com',
      password: '123456',
      passwordRe: '123456'
    });

    expect(component.signupForm.valid).toBeTruthy();
  });

  it('should signupForm being invalid cause email format', () => {
    component.signupForm.setValue({
      email: 'validmail.com',
      password: '123456',
      passwordRe: '123456'
    });
    
    expect(component.signupForm.valid).toBeFalsy();
  });

  it('should signupForm invalid cause password length', () => {
    component.signupForm.setValue({
      email: 'valid@mail.com',
      password: '12345',
      passwordRe: '12345'
    });
    
    expect(component.signupForm.valid).toBeFalsy();
  });

  it('should signupForm being invalid cause passwords not match', () => {
    component.signupForm.setValue({
      email: 'valid@mail.com',
      password: '123456',
      passwordRe: '123457'
    });
    
    expect(component.signupForm.valid).toBeFalsy();
  });

});
