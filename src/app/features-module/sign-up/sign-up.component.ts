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
        pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      doyouneed: ['', Validators.required],
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // onSubmit() {
  //   if (this.accountForm.valid) {
  //     const formData = this.accountForm.value;
  //     this._login.signup(formData).subscribe({
  //       next: (response: any) => {
  //         console.log(response);
          
  //         if (response.status === 200) {
  //           alert('Sign-up successful!');
  //           this._router.navigate(['/in/insight/customer']);
  //         } else if (response.status === 409) {
  //           alert('User already exists.!');
  //         } else {
  //           alert('Sign-up failed. Please try again.');
  //         }
  //       },
  //       error: (err) => {
  //         if (err.status === 409) {
  //           alert('User already exists.!');
  //         } else {
  //           alert('Sign-up failed. Please try again.');

  //           alert('An error occurred. Please try again later.');
  //           console.error('Sign-up error:', err);
  //         }
  //       },
  //     });
  //   } else {
  //     this.accountForm.markAllAsTouched();
  //   }
  // }
  onSubmit() {
  if (this.accountForm.valid) {
    const formData = this.accountForm.value;
    this._login.signup(formData).subscribe({
      next: (response: any) => {
        console.log('Signup response:', response);

        if (response.status === 200) {
          alert('Sign-up successful!');

          // ✅ Mark user as logged in (same as login())
          this._login.setLoginStatus(true);
          localStorage.setItem('isLoggedIn', 'true');

          // ✅ Save token & userId if returned
          if (response.data?.token) {
            localStorage.setItem('token', response.data.token);
          }
          if (response.data?._id) {
            localStorage.setItem('userId', response.data._id);
          }

          // ✅ Navigate to dashboard
          this._router.navigate(['/in/insight/customer']);
        } 
        else if (response.status === 409) {
          alert('User already exists!');
        } 
        else {
          alert('Sign-up failed. Please try again.');
        }
      },
      error: (err) => {
        if (err.status === 409) {
          alert('User already exists!');
        } else {
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
