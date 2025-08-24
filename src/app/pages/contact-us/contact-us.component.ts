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
      city: ['New York'],
      state: ['NY'],
      zip: ['10001'],
      address: ['123 Main Street'],
      phoneNumber: ['+1-800-555-1234'],
      email: ['support@example.com'],
    });
    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
  }

  backToHomepage() {
    this.router.navigateByUrl('/in/insight/editor/pages');
  }
  saveContact(): void {
    if (this.contactForm.invalid) {
      this.alertService.error('Form is invalid.');
      return;
    }

    const payload = {
      service: this.contactForm.value,
    };

    console.log(payload, 'payload before API');

    this.pagesService.editPages(this.pageId, payload).subscribe({
      next: (res) => {
        console.log('contact updated successfully:', res);
        this.alertService.success('Service updated successfully!');
        // this.getPageData(); // refresh page data after update
      },
      error: (err) => {
        console.error('Failed to update contact:', err);
        this.alertService.error('Failed to update service.');
      },
    });
  }
}
