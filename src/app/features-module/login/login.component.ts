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
import { gapi } from 'gapi-script';
import { LoaderComponent } from 'src/app/commonComponent/loader/loader.component';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule, LoaderComponent],
  providers: [LoginService],
})
export class LoginComponent {
  declare gapi: any;
  submitted = false;
  loginForm!: FormGroup;
  passwordVisible: boolean = false;
  isLoading = false;

  constructor(
    private _login: LoginService,
    private _route: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.alertService.success('Login successfully');

    this.buildForm();
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id:
          '621564911356-jr2mo7msre6a4e2ph8et3bp66t7t1n18.apps.googleusercontent.com',
      });
    });
  }
  signIn() {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signIn().then((user: gapi.auth2.GoogleUser) => {
      const profile = user.getBasicProfile();
      console.log('User Logged In:', profile.getEmail());
      // You can send profile info to the backend for further verification
    });
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
    this.isLoading = true;

    this._login.login(login).subscribe(
      (result) => {
        console.log('userrrrrrrr', result);
        if (result.status === 200) {
          this._login.setLoginStatus(true);
          localStorage.setItem('isLoggedIn', 'true');

          localStorage.setItem('token', result.data.token);
          localStorage.setItem('userId', result.data._id);
          console.log('User IDvsmvkkkkkkkkk:', result.data._id);
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
      },
      () => {
        this.isLoading = false; // 👈 loader stop (complete hone par)
      }
    );
  }
}
