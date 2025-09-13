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
      sectionSubtitle: [''],
    });
    this.getSectionDetailData();
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
              sectionSubtitle: res.data.section.subtitle || '',
            });
            this.testimonialGroups = res.data.section.groups || [];
          }
        },
        error: (err) => {
          console.error('Error loading section detail', err);
        },
      });
  }
  openForm(pageId: string, groupId?: string) {
    if (groupId) {
      this.router.navigate([
        '/in/insight/editor/testimonialform',
        pageId,
        groupId,
      ]);
    } else {
      this.router.navigate(['/in/insight/editor/testimonialform', pageId]);
    }
  }
  backToHomepage() {
    this.router.navigate(['/in/insight/editor/home', this.pageId]);
  }
  saveSection() {}
}
