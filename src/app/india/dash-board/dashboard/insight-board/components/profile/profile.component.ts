import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  emailForm!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) {}
  userId: any;

  ngOnInit(): void {
    this.initializeForms();
    this.getProfileDetail();
  }

  // Form initialization in a separate function for clarity
  initializeForms() {
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phone: [''],
      whatsapp: [''],
      useSame: [true],
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });

    this.emailForm = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
    });

    // Auto update WhatsApp when checkbox is selected
    this.profileForm.get('useSame')?.valueChanges.subscribe((val) => {
      if (val) {
        const phone = this.profileForm.get('phone')?.value;
        this.profileForm.get('whatsapp')?.setValue(phone);
      }
    });

    // Sync WhatsApp when phone changes and checkbox is checked
    this.profileForm.get('phone')?.valueChanges.subscribe((phone) => {
      if (this.profileForm.get('useSame')?.value) {
        this.profileForm.get('whatsapp')?.setValue(phone);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getProfileDetail() {
    this.profileService.getProfile().subscribe({
      next: (data: any) => {
        console.log(data, 'Fetched Profile Data');
        this.profileForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          whatsapp: data.whatsapp,
          useSame: data.useSame ?? true, // default true if not available
        });
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
      },
    });
  }

  onSubmit() {
    console.log('Form Submitted:', this.profileForm.value);
    // TODO: Call API to update profile here
  }
}
