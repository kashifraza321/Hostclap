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
import { merge, tap } from 'rxjs';

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
  state$ = this.pagesService.state$;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private pagesService: PagesService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this.contactForm = this.fb.group({
      title: [''],
      subtitle: [''],
      country: [''],
      city: [''],
      state: [''],
      zip: [''],
      address: [''],
      phoneNumber: [''],
      email: [''],
    });
    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
    this.getPageData();

    merge(
      this.contactForm.valueChanges.pipe(
        tap((val) => {
          console.log('Form Value Changed:', val);
          this.applyContactUsChanges();
        })
      )
    ).subscribe();

    this.state$.subscribe((state) => {
      console.log('State Changed:', state);
    });
  }

  backToHomepage() {
    this.router.navigateByUrl('/in/insight/editor/pages');
  }
  getPageData() {
    this.pagesService.getPageDetail(this.pageId).subscribe({
      next: (res) => {
        const contact = res.data?.contactUs;
        if (contact) {
          this.contactForm.patchValue(contact);
        }
        // console.log('Form after patch:', this.contactForm.value);
      },
    });
  }
  saveContact(): void {
    if (this.contactForm.invalid) {
      this.alertService.error('Form is invalid.');
      return;
    }

    const payload = {
      contactUs: this.contactForm.value,
    };

    this.pagesService.editPages(this.pageId, payload).subscribe({
      next: () => {
        this.alertService.success('Contact info updated successfully!');
      },
      error: () => {
        this.alertService.error('Failed to update contact.');
      },
    });
  }

  // saveContact(): void {
  //   if (this.contactForm.invalid) {
  //     this.alertService.error('Form is invalid.');
  //     return;
  //   }

  //   this.pagesService.getPageDetail(this.pageId).subscribe({
  //     next: (pageData) => {
  //       console.log('Existing page data:', pageData);

  //       const updatedPayload = {
  //         contactUs: this.contactForm.value,
  //       };

  //       console.log('Payload to be sent:', updatedPayload);

  //       this.pagesService.editPages(this.pageId, updatedPayload).subscribe({
  //         next: (res) => {
  //           console.log('Update success response:', res);
  //           this.alertService.success('Contact info updated successfully!');
  //         },
  //         error: (err) => {
  //           console.error('Failed to update contact:', err);
  //           this.alertService.error('Failed to update contact.');
  //         },
  //       });
  //     },
  //     error: (err) => {
  //       console.error('Failed to fetch existing page data:', err);
  //       this.alertService.error('Failed to fetch existing data.');
  //     },
  //   });
  // }

  applyContactUsChanges() {
    const val = this.contactForm.value;
    console.log('Applying Contact Us changes:', val);
    this.pagesService.updatePreviewSection('contactUs', val);
  }
}
