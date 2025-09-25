import { Component } from '@angular/core';
import { PagesService } from '../pages.service';
import { AlertService } from 'src/app/services/Toaster/alert.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent {
  sectionForm!: FormGroup;

  // For later use (API)
  sectionId: string = '';
  pageId: string = '';
  constructor(
    private fb: FormBuilder,
    private pagesService: PagesService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
    console.log(this.pageId, ' pageId found');
    this.sectionForm = this.fb.group({
      sectionTitle: ['', [Validators.required, Validators.maxLength(255)]],
      sectionSubtitle: ['', [Validators.required, Validators.maxLength(255)]],
      desktopPaddingTop: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      desktopPaddingBottom: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      desktopImageSize: [
        50,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      height: [
        50,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      width: [
        100,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });

    this.getSectionDetailData();
  }
  backToHomepage() {
    this.router.navigate(['/in/insight/editor/home', this.pageId]);
  }
  getSectionDetailData() {
    this.pagesService.GET_SECTION_DETAIL(this.pageId, 'about_us').subscribe({
      next: (res) => {
        if (res?.data?.section) {
          this.sectionId = res.data.section._id;
          this.sectionForm.patchValue({
            sectionTitle: res.data.section.sectionTitle || '',
            sectionSubtitle: res.data.section.subtitle || '',
            desktopPaddingTop: res.data.section.desktopPaddingTop || 0,
            desktopPaddingBottom: res.data.section.desktopPaddingBottom || 0,
            desktopImageSize: res.data.section.desktopImageSize || 50,
            height: res.data.section.height || 50,
            width: res.data.section.width || 100,
          });
        }
      },
      error: (err) => {
        console.error('Error loading section detail', err);
      },
    });
  }
  saveSection() {
    if (this.sectionForm.invalid) {
      this.alertService.error('Please fill all required fields');
      return;
    }

    const data = {
      sectionType: 'about_us',
      sectionTitle: this.sectionForm.value.sectionTitle,
      subtitle: this.sectionForm.value.sectionSubtitle,
      desktopPaddingTop: this.sectionForm.value.desktopPaddingTop,
      desktopPaddingBottom: this.sectionForm.value.desktopPaddingBottom,
      desktopImageSize: this.sectionForm.value.desktopImageSize,
      height: this.sectionForm.value.height,
      width: this.sectionForm.value.width,
      pageId: this.pageId,
    };

    this.pagesService.createSection(data).subscribe({
      next: (res) => {
        this.sectionId = res.data._id;
        this.alertService.success('Section saved successfully');
      },
      error: () => {
        this.alertService.error('Failed to save section');
      },
    });
  }
  navigateTonewContent(pageId: string) {
    this.router.navigate(['/in/insight/editor/new-content', pageId]);
  }
}
