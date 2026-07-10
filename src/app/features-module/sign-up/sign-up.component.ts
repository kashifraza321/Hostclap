import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { AlertService } from 'src/app/services/Toaster/alert.service';
import { validate } from 'uuid';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  accountForm!: FormGroup;
  showPassword = false;
  constructor(
    private fb: FormBuilder,
    private _login: LoginService,
    private _router: Router,
     private alertService: AlertService,
  ) {}
  ngOnInit() {
    this.signupForm();
  }

  signupForm() {
    this.accountForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      companyName: [''],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: [''],
      city: [''],
      state: [''],
        pincode: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/)]],
      doyouneed: ['', Validators.required],
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.accountForm.valid) {
      const formData = this.accountForm.value;
      this._login.signup(formData).subscribe({
        next: (response: any) => {
          if (response.status === 200 && response.data?.token) {
            this.alertService.success('Sign-up successful!');

            // Mark user as logged in only when a token was actually returned
            this._login.setLoginStatus(true);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('token', response.data.token);
            if (response.data?._id) {
              localStorage.setItem('userId', response.data._id);
            }

            this._router.navigate(['/in/insight/customer']);
          } else if (response.status === 409) {
            this.alertService.error('User already exists!');
          } else {
            this.alertService.error('Sign-up failed. Please try again.');
          }
        },
        error: (err) => {
          if (err.status === 409) {
            this.alertService.error('User already exists!');
          } else {
            this.alertService.error('An error occurred. Please try again later.');
          }
        },
      });
    } else {
      this.accountForm.markAllAsTouched();
    }
  }
}
