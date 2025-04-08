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
      // phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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
          if (response.status === 200) {
            alert('Sign-up successful!');
            this._router.navigate(['/login']); // Or wherever you want to redirect
          } else {
            alert('Sign-up failed. Please try again.');
          }
        },
        error: (err) => {
          console.error('Sign-up error:', err);
          alert('An error occurred during sign-up. Please try again.');
        },
      });
    } else {
      this.accountForm.markAllAsTouched();
    }
  }
}
