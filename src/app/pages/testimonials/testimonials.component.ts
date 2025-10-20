import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/Toaster/alert.service';
import { PagesService } from '../pages.service';
import { merge, tap } from 'rxjs';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css',
})
export class TestimonialsComponent {
  testimonialGroups: any[] = [];
  TestiminialForm!: FormGroup;
  pageId: string = '';
  sectionId: string = '';
  selectedGroup: any = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pagesService: PagesService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
    console.log(this.pageId, ' pageId found');
    this.TestiminialForm = this.fb.group({
      sectionTitle: [''],
      subtitle: [''],
    });
    this.getSectionDetailData();
       merge(
      this.TestiminialForm.valueChanges.pipe(
        tap((val) => this.applyTestimonialChanges(val))
      )
    ).subscribe();
  }
  getSectionDetailData() {
    this.pagesService
      .GET_SECTION_DETAIL(this.pageId, 'testimonials')
      .subscribe({
        next: (res) => {
          console.log('Section detail:', res);
          if (res?.data?.section) {
            this.sectionId = res.data.section._id;

            this.TestiminialForm.patchValue({
              sectionTitle: res.data.section.sectionTitle || '',
              subtitle: res.data.section.subtitle || '',
            });
            this.testimonialGroups = res.data.section.groups || [];
          }
        },
        error: (err) => {
          console.error('Error loading section detail', err);
        },
      });
  }
    applyTestimonialChanges(val: any) {
    const data = {
      sectionTitle: val.sectionTitle || '',
     subtitle: val.subtitle || '',
      groups: this.testimonialGroups || [],
    };
    this.pagesService.updatePreviewSection('testimonials', data);
  }
  // openForm(pageId: string, groupId?: string) {
  //   if (groupId) {
  //     this.router.navigate([
  //       '/in/insight/editor/testimonialform',
  //       pageId,
  //       this.selectedGroup?._id,
  //     ]);
  //   } else {
  //     // this.router.navigate(['/in/insight/editor/testimonialform', pageId]);
  //   }
  // }

  backToHomepage() {
    this.router.navigate(['/in/insight/editor/home', this.pageId]);
  }
  openForm() {
    this.router.navigate([
      '/in/insight/editor/testimonialform',
      this.pageId,
      'add',
    ]);
  }

  navigateToForm(groupId: string) {
    this.router.navigate([
      '/in/insight/editor/testimonialform',
      this.pageId,
      groupId,
    ]);
  }

saveSection() {
  if (this.TestiminialForm.invalid) {
    this.alertService.error('Please fill all required fields');
    return;
  }

  const data = {
    sectionType: 'testimonials',        // specify the section type
    sectionTitle: this.TestiminialForm.value.sectionTitle,
    subtitle: this.TestiminialForm.value.subtitle, 
    pageId: this.pageId,
    sectionId: this.sectionId,          // include sectionId for update
  };

  this.pagesService.createSection(data).subscribe({
    next: (res: any) => {
      if (res?.status === 200) {
        this.alertService.success('Section updated successfully!');
        this.getSectionDetailData();     // refresh form with updated data
      } else {
        this.alertService.error(res?.message || 'Failed to update section');
      }
    },
    error: (err) => {
      console.error('Error updating section', err);
      this.alertService.error('Failed to update section');
    },
  });
}


}
