import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { AlertService } from '../../services/Toaster/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  providers: [LoginService],
})
export class LoginComponent {
  submitted = false;
  loginForm!: FormGroup;
  passwordVisible: boolean = false;

  constructor(
    private _login: LoginService,
    private _route: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  navigateToSignUp() {
    this.router.navigate(['/signUp']);
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const login = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this._login.login(login).subscribe(
      (result) => {
        console.log('userrrrrrrr', result);
        if (result.status === 200) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('token', result.data.token);
          this.alertService.success('Login successfully');
          this._route.navigate(['/in/insight/customer']);
        } else {
          // Handle invalid login response if necessary
          this.alertService.error(
            'Login failed. Please check your credentials.'
          );
        }
      },
      (err) => {
        console.error(err);
        this.alertService.error(
          'An error occurred during login. Please try again.'
        );
      }
    );
  }
}
