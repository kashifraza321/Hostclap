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
    console.log(this.pageId, 'page id in opening ');

    const formControls: Record<string, FormControl> = {
      sectionTitle: new FormControl('', Validators.required),
      sectionSubtitle: new FormControl('', Validators.required),
      is24HourFormat: new FormControl(false),

      ...this.daysOfWeek.reduce((acc, day) => {
        acc[`${day}Checked`] = new FormControl(false); // checkbox for each day
        acc[`${day}Start`] = new FormControl(
          { value: '', disabled: true },
          Validators.required
        ); // start time for each day, initially disabled
        acc[`${day}End`] = new FormControl(
          { value: '', disabled: true },
          Validators.required
        ); // end time for each day, initially disabled
        return acc;
      }, {} as Record<string, FormControl>),
    };

    this.openingHoursForm = this.fb.group(formControls);

    // Subscribe to changes in the checkbox controls to enable/disable the start and end times
    this.daysOfWeek.forEach((day) => {
      this.openingHoursForm
        .get(`${day}Checked`)
        ?.valueChanges.subscribe((checked) => {
          if (checked) {
            // Enable start and end time if checkbox is checked
            this.openingHoursForm.get(`${day}Start`)?.enable();
            this.openingHoursForm.get(`${day}End`)?.enable();
          } else {
            // Disable start and end time if checkbox is unchecked
            this.openingHoursForm.get(`${day}Start`)?.disable();
            this.openingHoursForm.get(`${day}End`)?.disable();
          }
        });
    });
  }
  saveOpeningHours(): void {
    console.log(this.openingHoursForm.valid); // Log the form status to check if it's valid
    if (this.openingHoursForm.invalid) {
      this.alertService.error(
        'Please fill in the opening hours for all selected days and section details.'
      );
      return;
    }

    const payload = this.openingHoursForm.value;
    console.log('Opening hours payload:', payload);

    // Call the API to save the opening hours data
    this.pagesService.editPages(this.pageId, payload).subscribe({
      next: (res) => {
        console.log('Opening hours updated successfully:', res);
        this.alertService.success('Opening hours updated successfully!');
        this.getPageData(); // Refresh page data
      },
      error: (err) => {
        console.error('Failed to update opening hours:', err);
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
