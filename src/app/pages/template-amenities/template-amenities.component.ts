import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PagesService } from '../pages.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AlertService } from 'src/app/services/Toaster/alert.service';
import { CommonModule } from '@angular/common';
import { merge, tap } from 'rxjs';

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
 amenitiesNames: this.fb.control([])
    });

    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
    console.log(this.pageId, 'pageidddddddddd');
    this.getPageData();
     merge(
    this.amenitiesForm.valueChanges.pipe(tap(() => this.applyAmenitiesChanges()))
  ).subscribe();
  }

  backToHomepage() {
    this.router.navigate(['/in/insight/editor/home', this.pageId]);
  }

  // Getter for amenitiesNames control
  get amenitiesNames() {
    return this.amenitiesForm.get('amenitiesNames') as FormControl;
  }

  // Toggle amenity selection
  toggleAmenity(event: Event, amenity: string) {
    const checked = (event.target as HTMLInputElement).checked;
    const current = this.amenitiesNames.value || [];

    if (checked) {
      this.amenitiesNames.setValue([...current, amenity]);
    } else {
      this.amenitiesNames.setValue(
        current.filter((a: string) => a !== amenity)
      );
    }
  }
  applyAmenitiesChanges() {
  const val = this.amenitiesForm.value;

  const data = {
    title: val.title || 'Amenities',
    titleVisible: val.titleVisible ?? true,
    subtitle: val.subtitle || '',
    amenitiesNames: val.amenitiesNames || [],
  };

  // ✅ Instantly update the preview state
  this.pagesService.updatePreviewSection('amenities', data);
}


  getPageData(): void {
    this.pagesService.getPageDetail(this.pageId).subscribe({
      next: (res) => {
        console.log('🔵 API full response:', res);

        if (res?.status === 200) {
          const amenities = res.data?.amenities;
          console.log('🟢 Amenities from API:', amenities);

          if (amenities) {
            this.amenitiesForm.patchValue({
              title: amenities.title || '',
              titleVisible: amenities.titleVisible || false,
              subtitle: amenities.subtitle || '',
              amenitiesNames: amenities.amenitiesNames || [],
            });
          }

          console.log(' Form after patch:', this.amenitiesForm.value);
        }
      },
      error: (err) => console.error('🔴 API Error:', err),
    });
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
          this.pagesService.updatePreviewSection('amenities', this.amenitiesForm.value);
        this.getPageData();
      },
      error: (err) => {
        console.error('Failed to update amenities:', err);
        this.alertService.error('Failed to update amenities.');
      },
    });
  }
  cancel() {}
}
