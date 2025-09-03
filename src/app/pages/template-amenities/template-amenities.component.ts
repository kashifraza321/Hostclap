import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PagesService } from '../pages.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AlertService } from 'src/app/services/Toaster/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-amenities',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './template-amenities.component.html',
  styleUrl: './template-amenities.component.css',
})
export class TemplateAmenitiesComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private pagesService: PagesService,
    private alertService: AlertService
  ) {}
  amenitiesForm!: FormGroup;
  pageId: string = '';
  pageData: any;
  suggestedAmenities: string[] = [
    '24/7 availability',
    'Parking available',
    'Debit & Credit Cards accepted',
    'Wifi on the premises',
    'Free consultation',
    'Wheelchair accessible',
    'By appointment only',
    'Bike parking available',
    'Cash only',
    'Good for children',
  ];
  ngOnInit(): void {
    // form initialize
    this.amenitiesForm = this.fb.group({
      title: ['Amenities'],
      titleVisible: [true],
      subtitle: [''],
      amenitiesNames: this.fb.array([]),
    });

    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
    console.log(this.pageId, 'pageidddddddddd');
  }
  get amenitiesNames(): FormArray {
    return this.amenitiesForm.get('amenitiesNames') as FormArray;
  }
  backToHomepage() {
    this.router.navigate(['/in/insight/editor/home', this.pageId]);
  }

  toggleAmenity(event: any, amenity: string) {
    if (event.target.checked) {
      this.amenitiesNames.push(this.fb.control(amenity));
    } else {
      const index = this.amenitiesNames.value.indexOf(amenity);
      if (index !== -1) {
        this.amenitiesNames.removeAt(index);
      }
    }
  }

  saveAmenities(): void {
    if (this.amenitiesForm.invalid) {
      this.alertService.error('Form is invalid.');
      return;
    }

    const payload = {
      amenities: this.amenitiesForm.value,
    };
    console.log(payload, 'payload before API');

    this.pagesService.editPages(this.pageId, payload).subscribe({
      next: (res) => {
        console.log('Amenities updated successfully:', res);
        this.alertService.success('Amenities updated successfully!');
        this.getPageData();
      },
      error: (err) => {
        console.error('Failed to update amenities:', err);
        this.alertService.error('Failed to update amenities.');
      },
    });
  }
  getPageData(): void {
    this.pagesService.getPageDetail(this.pageId).subscribe({
      next: (res) => {
        if (res?.status === 200) {
          console.log('Full API Response:', res);
          this.pageData = res.data;

          console.log('Page Data:', this.pageData);
        }
      },
      error: (err) => {
        console.error('API Error:', err);
      },
    });
  }
}
