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
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
  uploadedImages: SafeUrl[] = []; // For previewing uploaded images
  maxImages = 10;
  pageId: string = '';
  selectedFiles: File[] = [];
  groupId: string = '';
  subgroupId: string = '';
  sectionId: string = '';
  imgurl = environment.imageBaseUrl;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pagesService: PagesService,
    private alertService: AlertService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
    console.log(this.pageId, ' pageId found');
    this.subgroupId = this.route.snapshot.paramMap.get('subgroupId') || '';
    this.groupId = this.route.snapshot.paramMap.get('groupId') || '';
    console.log(this.groupId, ' groupId found');

    this.subgroupForm = this.fb.group({
      sectionType: ['service', Validators.required],
      subgroupName: ['', Validators.required],
      price: [null, Validators.required],
      unit: [null, Validators.required],
      promotionPrice: [''],
      bookable: [false],
     bookingOption: [''],
        bookingUrl: [''], 
          bookingButtonLabel: [''], 
      media: this.fb.array([]),
      totalBookingTime: this.fb.group({
        hours: [''],
        minutes: [''],
      }),
      description: ['', Validators.required],
    });

    if (this.subgroupId) {
      this.getSubGroupDetail(this.subgroupId);
    }
  }
  backToHomepage() {
    this.router.navigate(['/in/insight/editor/services', this.pageId]);
  }

  getSubGroupDetail(subgroupId: string) {
    this.pagesService.GetSubgroup_Detail(subgroupId).subscribe({
      next: (res) => {
        if (res?.data) {
          const subgroup = res.data;

          const mediaArray = this.subgroupForm.get('media') as FormArray;
          mediaArray.clear();
          this.uploadedImages = [];

          if (subgroup.media && subgroup.media.length) {
            subgroup.media.forEach((m: string) => {
              mediaArray.push(this.fb.control(m)); // Store file name/path

              const fullUrl = this.imgurl + m;
              const safeUrl: SafeUrl =
                this.sanitizer.bypassSecurityTrustUrl(fullUrl);
              this.uploadedImages.push(safeUrl); // Safe URL for Angular
            });
          }

          this.subgroupForm.patchValue({
            sectionType: subgroup.sectionType || 'service',
            subgroupName: subgroup.subgroupName || '',
            price: subgroup.price ?? null,
            unit: subgroup.unit ?? null,
            promotionPrice: subgroup.promotionPrice || '',
            bookable: subgroup.bookable ?? false,
             bookingOption: subgroup.bookingOption || '',
            bookingUrl: subgroup.bookingUrl || '',
           bookingButtonLabel: subgroup.bookingButtonLabel || '',
            totalBookingTime: {
              hours: subgroup.totalBookingTime?.[0]?.hours || '',
              minutes: subgroup.totalBookingTime?.[0]?.minutes || '',
            },
            description: subgroup.description || '',
          });
        }
      },
      error: (err) => {
        console.error('Error fetching subgroup details:', err);
      },
    });
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
            const currentGroup = groups.find(
              (g: any) => g._id === this.groupId
            );

            if (currentGroup) {
              console.log('Current Group ID:', currentGroup._id);

              const firstService = currentGroup.services?.[0];
              if (firstService) {
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

                this.uploadedImages =
                  firstService.media?.map(
                    (m: string) => `${this.imgurl}${m}`
                  ) || [];
              }
            } else {
              console.warn('No group found for groupId:', this.groupId);
            }
          }
        }
      },
      error: (err) => {
        console.error('Error loading section detail', err);
      },
    });
  }

  // onSubmit() {
  //   if (this.subgroupForm.invalid) {
  //     this.subgroupForm.markAllAsTouched();
  //     this.alertService.error('Please fill all required fields.');
  //     return;
  //   }

  //   const formData = new FormData();

  //   // Append basic fields
  //   formData.append('pageId', this.pageId);
  //   formData.append('groupId', this.groupId);
  //   formData.append('sectionType', this.subgroupForm.value.sectionType);
  //   formData.append('subgroupName', this.subgroupForm.value.subgroupName);
  //   formData.append('price', this.subgroupForm.value.price);
  //   formData.append('unit', this.subgroupForm.value.unit);
  //   formData.append(
  //     'promotionPrice',
  //     this.subgroupForm.value.promotionPrice || ''
  //   );
  //   formData.append('bookable', this.subgroupForm.value.bookable.toString());
  //   formData.append('description', this.subgroupForm.value.description);

  //   // Append totalBookingTime as JSON array
  //   // const totalBookingTime = this.subgroupForm.value.totalBookingTime;
  //   // const totalBookingArray = [
  //   //   { hours: totalBookingTime.hours, minutes: totalBookingTime.minutes },
  //   // ];
  //   formData.append(
  //     'totalBookingTime',
  //     JSON.stringify([{ hours: '02', minutes: '30' }])
  //   );

  //   // Append media files
  //   this.selectedFiles.forEach((file) => {
  //     formData.append('media', file);
  //   });
  //   // Call API
  //   this.pagesService.CREATE_Sub_GROUP(formData).subscribe({
  //     next: (res) => {
  //       this.alertService.success('Service subgroup created successfully!');
  //       this.router.navigate(['/services']);
  //     },
  //     error: (err) => {
  //       console.error('Error creating subgroup:', err);
  //       this.alertService.error('Failed to create service subgroup.');
  //     },
  //   });
  // }
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
    formData.append('price', this.subgroupForm.value.price || '');
    formData.append('unit', this.subgroupForm.value.unit || '');
    formData.append(
      'promotionPrice',
      this.subgroupForm.value.promotionPrice || ''
    );
    const isBookable = this.subgroupForm.value.bookable;
formData.append('bookable', isBookable.toString());

if (isBookable) {
  formData.append('bookingButtonLabel', this.subgroupForm.value.bookingButtonLabel || '');
  formData.append('bookingOption', this.subgroupForm.value.bookingOption || '');
  
  formData.append('bookingUrl', this.subgroupForm.value.bookingUrl || 'https://');
}

    formData.append('description', this.subgroupForm.value.description || '');
  const totalBookingTime = this.subgroupForm.value.totalBookingTime;
formData.append(
  'totalBookingTime',
  JSON.stringify([{
    hours: totalBookingTime.hours,
    minutes: totalBookingTime.minutes || 0 
  }])
);

    // Append media files
    this.selectedFiles.forEach((file) => {
      formData.append('media', file);
    });
 for (let [key, value] of (formData as any).entries()) {
  console.log(key, value);
}


    if (this.subgroupId) {
      // UPDATE
        formData.append('subgroupId', this.subgroupId);
  

      this.pagesService.UpdateSubgroups(formData).subscribe({
        next: (res) => {
          this.alertService.success('Service subgroup updated successfully!');
            // Realtime update preview
    const updatedSubgroup = res.data;
    const currentPreview = this.pagesService.getPreviewValue();
    
    this.pagesService.updatePreviewSection('services', {
      ...currentPreview.services,
      [updatedSubgroup._id]: updatedSubgroup
    });
        },

        error: () => {
          this.alertService.error('Failed to update service subgroup.');
        },
      });
    } else {
      // CREATE
      this.pagesService.CREATE_Sub_GROUP(formData).subscribe({
        next: (res) => {
          this.alertService.success('Service subgroup created successfully!');
            window.location.reload();
           const newSubgroup = res.data; // assume backend returns the new subgroup
    const currentPreview = this.pagesService.getPreviewValue();
    
    this.pagesService.updatePreviewSection('services', {
      ...currentPreview.services,
      [newSubgroup._id]: newSubgroup
    });
        },
        error: () => {
          this.alertService.error('Failed to create service subgroup.');
        },
      });
    }
  }
}
