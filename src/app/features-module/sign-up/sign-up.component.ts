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
    private _router: Router
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
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: [''],
      city: [''],
      state: [''],
      pincode: [''],
      doyouneed: [''],
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
          console.log(response);
          if (response.status === 200) {
            alert('Sign-up successful!');
            this._router.navigate(['/in/insight/customer']);
          } else if (response.status === 409) {
            alert('User already exists.!');
          } else {
            alert('Sign-up failed. Please try again.');
          }
        },
        error: (err) => {
          if (err.status === 409) {
            alert('User already exists.!');
          } else {
            alert('Sign-up failed. Please try again.');

            alert('An error occurred. Please try again later.');
            console.error('Sign-up error:', err);
          }
        },
      });
    } else {
      this.accountForm.markAllAsTouched();
    }
  }
}
