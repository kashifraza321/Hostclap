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
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.getProfileDetail();
    } else {
      console.error('User ID not found in localStorage.');
    }
    this.initializeForms();
  }

  initializeForms() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
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
    // this.profileForm.get('useSame')?.valueChanges.subscribe((val) => {
    //   if (val) {
    //     const phone = this.profileForm.get('phone')?.value;
    //     this.profileForm.get('whatsapp')?.setValue(phone);
    //   }
    // });

    // Sync WhatsApp when phone changes and checkbox is checked
    // this.profileForm.get('phone')?.valueChanges.subscribe((phone) => {
    //   if (this.profileForm.get('useSame')?.value) {
    //     this.profileForm.get('whatsapp')?.setValue(phone);
    //   }
    // });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getProfileDetail() {
    this.profileService.getProfile(this.userId).subscribe((data: any) => {
      console.log('Profile Data:', data);
      this.profileForm.patchValue({
        firstName: data.data?.userId.firstName || '_',
        lastName: data.data?.userId.lastName || '_',
        email: data.data.contactInfo?.email,
        phone: data.data.contactInfo?.phone,
        whatsapp: data.data.contactInfo?.phone,
        useSame: true,
      });
      this.emailForm.patchValue({
        newEmail: data.data.contactInfo?.email || '__',
        confirmEmail: data.data.contactInfo?.email || '__',
      });
    });
  }

  // profileForm

  onSubmit() {
    if (this.profileForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const payload = {
      firstName: this.profileForm.get('firstName')?.value,
      lastName: this.profileForm.get('lastName')?.value,
      phoneNumber: this.profileForm.get('phone')?.value,
    };

    console.log('Payload to send:', payload);

    this.profileService.updateProfile(payload).subscribe({
      next: (res) => {
        console.log('Profile updated successfully:', res);
        alert('Profile updated successfully!');
      },
      error: (err) => {
        console.error('Failed to update profile:', err);
        alert('Failed to update profile. Please try again.');
      },
    });
  }
}
