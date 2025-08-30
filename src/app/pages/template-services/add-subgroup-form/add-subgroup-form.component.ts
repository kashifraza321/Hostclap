import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PagesService } from '../../pages.service';
import { AlertService } from 'src/app/services/Toaster/alert.service';

@Component({
  selector: 'app-add-subgroup-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-subgroup-form.component.html',
  styleUrl: './add-subgroup-form.component.css',
})
export class AddSubgroupFormComponent {
  serviceForm!: FormGroup;
  subgroupForm!: FormGroup;
  uploadedImages: string[] = []; // For previewing uploaded images
  maxImages = 10;
  pageId: string = '';
  selectedFiles: File[] = [];
  groupId: string = '';
  sectionId: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pagesService: PagesService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
    console.log(this.pageId, ' pageId found');
    // this.serviceForm = this.fb.group({
    //   group: ['', Validators.required],
    //   serviceName: ['', Validators.required],
    //   price: [null, Validators.required],
    //   pricingUnit: ['', Validators.required],
    //   promotionalPrice: [''],
    //   bookable: [false],
    //   requestService: [''],
    //   bookingType: ['ueni'],
    //   totalBookingTime: this.fb.group({
    //     durationHours: [0],
    //     durationMinutes: [0],
    //     bufferHours: [0],
    //     bufferMinutes: [0],
    //   }),
    //   hasServiceVariations: [false],
    //   media: this.fb.array([]), // image preview base64
    //   description: ['', Validators.required],
    // });
    this.subgroupForm = this.fb.group({
      sectionType: ['service', Validators.required],
      subgroupName: ['', Validators.required],
      price: [null, Validators.required],
      unit: [null, Validators.required],
      promotionPrice: [''],
      bookable: [false],
      media: this.fb.array([]),
      totalBookingTime: this.fb.group({
        hours: [''],
        minutes: [''],
      }),
      description: ['', Validators.required],
    });
    this.getSectionDetailData();
  }

  // Getter for media array
  get mediaArray(): FormArray {
    return this.subgroupForm.get('media') as FormArray;
  }

  // Handle file selection
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach((file) => {
      this.selectedFiles.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImages.push(e.target.result);
      };
      reader.readAsDataURL(file);

      // Push file name into subgroupForm's media array
      this.mediaArray.push(this.fb.control(file.name));
    });

    input.value = ''; // Reset input after selection
  }

  removeImage(index: number) {
    this.uploadedImages.splice(index, 1);
    this.selectedFiles.splice(index, 1);
    this.mediaArray.removeAt(index);
  }
  editImage(index: number) {}
  // Remove image by index

  getSectionDetailData() {
    this.pagesService.GET_SECTION_DETAIL(this.pageId, 'service').subscribe({
      next: (res) => {
        console.log('Section detail:', res);

        if (res?.data?.section) {
          const groups = res.data.section.groups;

          if (groups && groups.length > 0) {
            this.groupId = groups[0]._id;
            console.log('Group ID found:', this.groupId);

            const firstService = groups[0].services?.[0];

            if (firstService) {
              // ✅ Patch values to subgroupForm instead of serviceForm
              this.subgroupForm.patchValue({
                subgroupName: firstService.subgroupName || '',
                price: firstService.price || '',
                unit: firstService.unit || '',
                promotionPrice: firstService.promotionPrice || '',
                description: firstService.description || '',
                bookable: firstService.bookable || false,
                totalBookingTime: {
                  hours: firstService.totalBookingTime?.[0]?.hours || '',
                  minutes: firstService.totalBookingTime?.[0]?.minutes || '',
                },
              });

              // ✅ Load media preview
              this.uploadedImages =
                firstService.media?.map(
                  (m: string) => `https://your-base-url/${m}` // Replace with correct URL
                ) || [];
            }
          } else {
            console.warn('No groups found in this section');
          }
        }
      },
      error: (err) => {
        console.error('Error loading section detail', err);
      },
    });
  }

  onSubmit() {
    if (this.subgroupForm.invalid) {
      this.subgroupForm.markAllAsTouched();
      this.alertService.error('Please fill all required fields.');
      return;
    }

    const formData = new FormData();

    // Append basic fields
    formData.append('pageId', this.pageId);
    formData.append('groupId', this.groupId);
    formData.append('sectionType', this.subgroupForm.value.sectionType);
    formData.append('subgroupName', this.subgroupForm.value.subgroupName);
    formData.append('price', this.subgroupForm.value.price);
    formData.append('unit', this.subgroupForm.value.unit);
    formData.append(
      'promotionPrice',
      this.subgroupForm.value.promotionPrice || ''
    );
    formData.append('bookable', this.subgroupForm.value.bookable.toString());
    formData.append('description', this.subgroupForm.value.description);

    // Append totalBookingTime as JSON array
    const totalBookingTime = this.subgroupForm.value.totalBookingTime;
    const totalBookingArray = [
      { hours: totalBookingTime.hours, minutes: totalBookingTime.minutes },
    ];
    formData.append('totalBookingTime', JSON.stringify(totalBookingArray));

    // Append media files
    this.selectedFiles.forEach((file) => {
      formData.append('media', file);
    });

    // Call API
    this.pagesService.CREATE_Sub_GROUP(formData).subscribe({
      next: (res) => {
        this.alertService.success('Service subgroup created successfully!');
        this.router.navigate(['/services']);
      },
      error: (err) => {
        console.error('Error creating subgroup:', err);
        this.alertService.error('Failed to create service subgroup.');
      },
    });
  }
}
