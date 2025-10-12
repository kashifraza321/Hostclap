import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertService } from 'src/app/services/Toaster/alert.service';
import { PagesService } from '../pages.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-opening-hours',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './opening-hours.component.html',
  styleUrl: './opening-hours.component.css',
})
export class OpeningHoursComponent {
  pageId: string = '';
  sectionId: string = '';
  openingHoursForm!: FormGroup;
  daysOfWeek: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private alertService: AlertService,
    private pagesService: PagesService
  ) {}
  ngOnInit() {
     this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
     this.sectionId = this.route.snapshot.queryParamMap.get('sectionId') || '';
  console.log(' Section ID in OpeningHoursComponent:', this.sectionId);

    console.log(this.pageId, 'page id in opening ');
    console.log(this.sectionId, 'section id in opening ');

    const formControls: Record<string, FormControl> = {
      sectionTitle: new FormControl('', Validators.required),
      sectionSubtitle: new FormControl('', Validators.required),
      is24HourFormat: new FormControl(false),

      ...this.daysOfWeek.reduce((acc, day) => {
        acc[`${day}Checked`] = new FormControl(false);
        acc[`${day}Start`] = new FormControl({ value: '', disabled: true });
        acc[`${day}End`] = new FormControl({ value: '', disabled: true });
        return acc;
      }, {} as Record<string, FormControl>),
    };

    this.openingHoursForm = this.fb.group(formControls);

    // Enable/disable start and end time based on checkbox
    this.daysOfWeek.forEach((day) => {
      this.openingHoursForm
        .get(`${day}Checked`)
        ?.valueChanges.subscribe((checked) => {
          if (checked) {
            this.openingHoursForm.get(`${day}Start`)?.enable();
            this.openingHoursForm.get(`${day}End`)?.enable();
          } else {
            this.openingHoursForm.get(`${day}Start`)?.disable();
            this.openingHoursForm.get(`${day}End`)?.disable();
          }
        });
    });
    this.getSectionDetailData()
  }
    getSectionDetailData() {
    this.pagesService.GET_SECTION_DETAIL(this.pageId, 'opening_hours').subscribe({
      next: (res) => {
        console.log('Section detail:', res);
        if (res?.data?.section) {
          this.sectionId = res.data.section._id;
          // this.sectionType = res.data.section.sectionType;

          // formValue.patchValue({
          //   sectionTitle: res.data.section.sectionTitle || '',
          //   sectionSubtitle: res.data.section.subtitle || '',
          // });
          // this.serviceGroups = res.data.section.groups || [];
        }
      },
      error: (err) => {
        console.error('Error loading section detail', err);
      },
    });
  }
 saveOpeningHours(): void {
    if (this.openingHoursForm.invalid) {
      this.alertService.error('Please fill all required fields.');
      return;
    }

    const formValue = this.openingHoursForm.value;

    const openingHours = this.daysOfWeek.map((day) => {
      const isOpen = formValue[`${day}Checked`];
      return isOpen
        ? {
            day,
            isOpen: true,
            openTime: formValue[`${day}Start`] || '',
            closeTime: formValue[`${day}End`] || '',
          }
        : { day, isOpen: false };
    });

    const payload = {
      sectionId: this.sectionId, 
      sectionTitle: formValue.sectionTitle,
      subtitle: formValue.sectionSubtitle,
      openingHours,
    };

    console.log(' Final Opening Hours Payload:', payload);

    this.pagesService.UpdateOpeningHours(payload).subscribe({
      next: () => {
        this.alertService.success('Opening hours updated successfully!');
      },
      error: () => {
        this.alertService.error('Failed to update opening hours.');
      },
    });
  }


  cancel(): void {
    // Reset the form or navigate away
    this.openingHoursForm.reset();
  }

  getPageData(): void {
    // Method to refresh the page data after successful update
  }
  backToHomepage() {
    this.router.navigate(['/in/insight/editor/home', this.pageId]);
  }
}
