import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { checkPasswords } from 'src/app/helpers';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    passwordRe: new FormControl('', [Validators.required, Validators.minLength(6)])
  }, { validators: checkPasswords });

  errorEmailExists: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    
  }

  createUser() {
    this.authService.createUser(this.signupForm.get('email')?.value, this.signupForm.get('password')?.value)
      .then(_ => this.router.navigate(['/']))
      .catch(_ => this.errorEmailExists = true);
  }

}
