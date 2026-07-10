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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css',
})
export class LocationComponent {
  locationForm!: FormGroup;
  pageId: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private pagesService: PagesService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this.locationForm = this.fb.group({
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
  }

  backToHomepage() {
    this.router.navigateByUrl('/in/insight/editor/pages');
  }
  saveContact(): void {
    if (this.locationForm.invalid) {
      this.alertService.error('Form is invalid.');
      return;
    }

    const updatedPayload = {
      contactUs: this.locationForm.value,
    };

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
  }
}
