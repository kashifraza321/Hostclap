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
  // Becomes true once the section's backend data has loaded (or it's confirmed
  // to be a brand-new section). Guards the live-preview push so early edits
  // don't overwrite backend data with blanks.
  private dataLoaded = false;

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
    // Only mirror form edits into the shared preview AFTER backend data has
    // loaded. Otherwise the first keystroke pushes empty title/subtitle and an
    // empty `groups: []`, wiping the backend testimonials from the preview.
    this.TestiminialForm.valueChanges.subscribe(() => {
      if (!this.dataLoaded) {
        return;
      }
      this.pagesService.updatePreviewSection('testimonials', {
        sectionTitle: this.TestiminialForm.value.sectionTitle,
        subtitle: this.TestiminialForm.value.subtitle,
        groups: this.testimonialGroups,
      });
    });
     this.pagesService.triggerScroll('testimonial');

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
            }, { emitEvent: false });
            this.testimonialGroups = res.data.section.groups || [];
            this.pagesService.updatePreviewSection('testimonials', {
  sectionTitle: res.data.section.sectionTitle,
  subtitle: res.data.section.subtitle,
  groups: this.testimonialGroups
});
          }
          // Backend load finished (whether or not a section existed). From now
          // on it's safe to mirror the user's edits into the preview.
          this.dataLoaded = true;
        },
        error: (err) => {
          console.error('Error loading section detail', err);
          // Allow editing a brand-new section even if the fetch failed.
          this.dataLoaded = true;
        },
      });
  }
applyTestimonialChanges(val: any) {
  const data = {
    sectionTitle: val.sectionTitle,
    subtitle: val.subtitle,
    groups: this.testimonialGroups
  };

  this.pagesService.updatePreviewSection('testimonials', data);
}
 
   deleteGroup(subgroupId: string, sectionType: string) {
  console.log(sectionType, 'pricelist sectiontype');
  this.pagesService.deleteServiesBlock(sectionType, subgroupId).subscribe({
    next: (res) => {
      console.log('Group deleted:', res);
      this.alertService.success('Group deleted successfully');

      //  Remove from UI list
      this.testimonialGroups = this.testimonialGroups.filter(
        (group) => group._id !== subgroupId
      );
      this.pagesService.updatePreviewSection('testimonials', {
  sectionTitle: this.TestiminialForm.value.sectionTitle,
  subtitle: this.TestiminialForm.value.subtitle,
  groups: this.testimonialGroups
});
    },
    error: (err) => {
      console.error('Error deleting group:', err);
      this.alertService.error('Failed to delete group');
    },
  });
}


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
    sectionType: 'testimonials',       
    sectionTitle: this.TestiminialForm.value.sectionTitle,
    subtitle: this.TestiminialForm.value.subtitle, 
    pageId: this.pageId,
    sectionId: this.sectionId,         
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
