import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PagesService } from '../../pages.service';
import { AlertService } from 'src/app/services/Toaster/alert.service';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-testimonial-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './testimonial-form.component.html',
  styleUrl: './testimonial-form.component.css',
})
export class TestimonialFormComponent {
  testimonialForm!: FormGroup;
  selectedFile: File | null = null;
  sectionId: string = '';
  pageId: string = '';
  groupId: string = '';
  stars: number[] = [1, 2, 3, 4, 5];
  starColorActive = true;
  imagePreview: SafeUrl | null = null;
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
    this.groupId = this.route.snapshot.paramMap.get('groupId') || '';

    console.log(this.pageId, ' pageId found');
    console.log(this.groupId, ' groupId found');
    this.testimonialForm = this.fb.group({
      reviewerName: ['', Validators.required],
      date: ['', Validators.required],
      rating: [2, Validators.required],
      ratingColour: ['red'],
      avatar: [false],
      avatarType: ['image'],
      quote: ['', Validators.required],
      image: [null],
    });
    if (this.groupId) {
      this.getSectionDetailData();
    }
  }
  getSectionDetailData() {
    this.pagesService
      .GET_SECTION_DETAIL(this.pageId, 'testimonials')
      .subscribe({
        next: (res) => {
          if (res?.data?.section) {
            this.sectionId = res.data.section._id;

            this.testimonialForm.patchValue({
              sectionId: this.sectionId,
            });

            const group = res.data.section.groups.find(
              (g: any) => g._id === this.groupId
            );

            if (group) {
              const testimonial = group.testimonial;

              this.testimonialForm.patchValue({
                reviewerName: testimonial.reviewerName || '',
                date: testimonial.date ? testimonial.date.split('T')[0] : '',
                rating: testimonial.rating || 2,
                ratingColour: testimonial.ratingColour || 'red',
                avatar: testimonial.avatar || false,
                avatarType: testimonial.avatarType || 'image',
                quote: testimonial.quote || '',
              });

              if (testimonial.imageUrl) {
                this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(
                  this.imgurl + testimonial.imageUrl
                );
              }
            }
          }
        },
        error: (err) => {
          console.error('Error loading section detail', err);
        },
      });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.testimonialForm.patchValue({ image: file });

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onDeleteImage(event: MouseEvent) {
    event.stopPropagation(); // prevent click on upload box
    this.selectedFile = null;
    this.imagePreview = null;
    this.testimonialForm.patchValue({ image: null });
  }

  setRating(rating: number) {
    this.testimonialForm.get('rating')?.setValue(rating);
  }

  setStarColor(event: any) {
    this.starColorActive = event.target.checked;
  }
  toggleAvatar(event: any) {
    this.testimonialForm.patchValue({ avatar: event.target.checked });
  }

  setAvatarType(type: string) {
    this.testimonialForm.patchValue({ avatarType: type });
  }

  setQuote(event: Event) {
    const content = (event.target as HTMLElement).innerText;
    this.testimonialForm.patchValue({ quote: content });
  }

  // save() {
  //   if (this.testimonialForm.invalid) return;

  //   const formData = new FormData();
  //   formData.append('pageId', this.pageId);
  //   formData.append('sectionId', this.sectionId);
  //   formData.append('sectionType', 'testimonials');

  //   formData.append(
  //     'reviewerName',
  //     this.testimonialForm.get('reviewerName')?.value || ''
  //   );
  //   formData.append(
  //     'date',
  //     new Date(this.testimonialForm.get('date')?.value)
  //       .toISOString()
  //       .split('T')[0]
  //   );
  //   formData.append('rating', this.testimonialForm.get('rating')?.value || '0');
  //   formData.append(
  //     'ratingColour',
  //     this.testimonialForm.get('ratingColour')?.value || ''
  //   );
  //   formData.append(
  //     'avatar',
  //     this.testimonialForm.get('avatar')?.value ? 'true' : 'false'
  //   );
  //   formData.append(
  //     'avatarType',
  //     this.testimonialForm.get('avatarType')?.value || 'image'
  //   );
  //   formData.append('quote', this.testimonialForm.get('quote')?.value || '');

  //   if (this.selectedFile) {
  //     formData.append('image', this.selectedFile, this.selectedFile.name);
  //   }

  //   console.log('Payload being sent:');
  //   formData.forEach((value, key) => {
  //     console.log(key, value);
  //   });

  //   this.pagesService.UpdateTestimonial(formData).subscribe({
  //     next: (res) => {
  //       console.log(' Success:', res);
  //       this.alertService.success('Testimonial updated successfully');
  //     },
  //     error: (err) => {
  //       console.error(' Error:', err);
  //       this.alertService.error('Failed to update testimonial');
  //     },
  //   });
  // }
  save() {
    if (this.testimonialForm.invalid) return;

    const formData = new FormData();
    formData.append('pageId', this.pageId);
    formData.append('sectionId', this.sectionId);
    formData.append('sectionType', 'testimonials');

    // Append form values to formData
    formData.append(
      'reviewerName',
      this.testimonialForm.get('reviewerName')?.value || ''
    );
    formData.append('date', this.testimonialForm.get('date')?.value || '');
    formData.append('rating', this.testimonialForm.get('rating')?.value || '0');
    formData.append(
      'ratingColour',
      this.testimonialForm.get('ratingColour')?.value || ''
    );
    formData.append(
      'avatar',
      this.testimonialForm.get('avatar')?.value ? 'true' : 'false'
    );
    formData.append(
      'avatarType',
      this.testimonialForm.get('avatarType')?.value || 'image'
    );
    formData.append('quote', this.testimonialForm.get('quote')?.value || '');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    if (this.groupId === 'add') {
      // formData.append('groupId', '');
    } else {
      formData.append('groupId', this.groupId);
    }

    this.pagesService.UpdateTestimonial(formData).subscribe({
      next: () => {
        const successMessage =
          this.groupId === 'add'
            ? 'Testimonial created successfully'
            : 'Testimonial updated successfully';
        this.alertService.success(successMessage);
        this.backTo();
      },
      error: () => {
        this.alertService.error('Failed to save testimonial');
      },
    });
  }

  backTo() {
    this.router.navigate(['/in/insight/editor/Testimonials', this.pageId]);
  }
}
