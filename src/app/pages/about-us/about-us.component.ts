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

 serviceGroups: any[] = [];
  sectionId: string = '';
  pageId: string = '';
  groupId: string = '';
  
  
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
    this.pagesService.GET_SECTION_DETAIL(this.pageId, 'aboutus').subscribe({
      next: (res) => {
        if (res?.data?.section) {
          this.sectionId = res.data.section._id;
          this.sectionForm.patchValue({
            sectionTitle: res.data.section.sectionTitle || '',
            sectionSubtitle: res.data.section.subtitle || '',
          });
            this.serviceGroups = res.data.section.groups || [];
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
      sectionType: 'aboutus',
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
    deleteGroup(subgroupId: string, sectionType: string) {
    console.log(sectionType, 'pricelist sectiontype');
    this.pagesService.deleteServiesBlock(sectionType, subgroupId).subscribe({
      next: (res) => {
        console.log('Group deleted:', res);
        this.alertService.success('Group deleted successfully');

        // Remove from UI list
        this.serviceGroups = this.serviceGroups.filter(
          (g) => g._id !== subgroupId
        );
      },
      error: (err) => {
        console.error('Error deleting group:', err);
        this.alertService.error('Failed to delete group');
      },
    });
  }
  navigateTonewContent(pageId: string, groupId?: string) {
    if (groupId) {
   console.log(groupId, 'Navigating to edit existing group');
      this.router.navigate(['/in/insight/editor/new-content', pageId, groupId]);
    } else {
      // Creating new content block
      this.router.navigate(['/in/insight/editor/new-content', pageId]);
    }
  }
}
