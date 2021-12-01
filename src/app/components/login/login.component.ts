import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  loginError: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login(): void {
    this.authService.login(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
      .then(_ => this.router.navigate(['/']))
      .catch(x => this.loginError = true);
  }
}
