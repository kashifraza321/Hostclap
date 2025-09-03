import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PagesService } from '../pages.service';
import { AlertService } from 'src/app/services/Toaster/alert.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css',
})
export class ContactUsComponent {
  contactForm!: FormGroup;
  pageId: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private pagesService: PagesService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this.contactForm = this.fb.group({
      title: ['Get in Touch'],
      subtitle: ['We’d love to hear from you'],
      country: ['USA'],
      city: [''],
      state: [''],
      zip: ['10001'],
      address: ['123 Main Street'],
      phoneNumber: ['+1-800-555-1234'],
      email: ['support@example.com'],
    });
    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
    this.pagesService.getPageDetail(this.pageId).subscribe({
      next: (pageData) => {
        console.log('Page data:', pageData);
        // Patch the form with contactUs data
        if (pageData?.contactUs) {
          this.contactForm.patchValue(pageData.contactUs);
        }
      },
      error: (err) => {
        this.alertService.error('Failed to fetch page data.');
      },
    });
  }

  backToHomepage() {
    this.router.navigateByUrl('/in/insight/editor/pages');
  }
  // saveContact(): void {
  //   if (this.contactForm.invalid) {
  //     this.alertService.error('Form is invalid.');
  //     return;
  //   }

  //   const payload = {
  //     contactus: this.contactForm.value,
  //   };

  //   console.log(payload, 'payload before API');

  //   this.pagesService.editPages(this.pageId, payload).subscribe({
  //     next: (res) => {
  //       console.log('contact updated successfully:', res);
  //       this.alertService.success('Contact info updated successfully!');
  //     },
  //     error: (err) => {
  //       console.error('Failed to update contact:', err);
  //       this.alertService.error('Failed to update contact.');
  //     },
  //   });
  // }
  saveContact(): void {
    if (this.contactForm.invalid) {
      this.alertService.error('Form is invalid.');
      return;
    }

    this.pagesService.getPageDetail(this.pageId).subscribe({
      next: (pageData) => {
        console.log('Existing page data:', pageData);

        const updatedPayload = {
          contactUs: this.contactForm.value,
        };

        console.log('Payload to be sent:', updatedPayload);

        this.pagesService.editPages(this.pageId, updatedPayload).subscribe({
          next: (res) => {
            console.log('Update success response:', res);
            this.alertService.success('Contact info updated successfully!');
          },
          error: (err) => {
            console.error('Failed to update contact:', err);
            this.alertService.error('Failed to update contact.');
          },
        });
      },
      error: (err) => {
        console.error('Failed to fetch existing page data:', err);
        this.alertService.error('Failed to fetch existing data.');
      },
    });
  }
}
