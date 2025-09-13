import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { PagesService } from '../pages.service';
import { AlertService } from 'src/app/services/Toaster/alert.service';

@Component({
  selector: 'app-merchant-policy',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, QuillModule],
  templateUrl: './merchant-policy.component.html',
  styleUrl: './merchant-policy.component.css',
})
export class MerchantPolicyComponent {
  pageForm!: FormGroup;
  isSectionVisible = false;
  pagesList: any[] = [];
  showHomePage: boolean = false;
  selectedPage: any = null;
  pageId: string = '';
  currentPageName: string = '';
  pageData: any;
  editorModules = {
    toolbar: '#custom-toolbar',
  };

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ color: [] }], // color picker
      [{ size: ['small', false, 'large', 'huge'] }],
      ['link'],
      [{ list: 'bullet' }, { list: 'ordered' }],
      [{ header: [false, 1, 2] }],
      [{ align: [] }],
    ],
  };

  // To track the currently selected policy

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pagesService: PagesService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
    console.log(this.pageId, ' pageId miliiiiiiiiii');
    this.pageForm = this.fb.group({
      pageType: ['policy'],
      pageName: ['', Validators.required],
      url: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.getPageDetail(this.pageId);
  }

  getPages() {
    this.pagesService.getPages().subscribe({
      next: (res) => {
        console.log('Fetched pages:', res);

        this.pagesList = res.data?.list || res.data || [];

        console.log(this.pageId, 'pageid in pages');
        if (this.pageId) {
          this.getPageDetail(this.pageId);
        }

        console.log(this.pagesList, 'pagelist');
        // this.data.pageData = this.pagesList;
      },
      error: (err) => {
        console.error('Error loading pages:', err);
        // this.alertService.error("Failed to load pages.");
      },
    });
  }
  saveInlinePage(): void {
    if (this.pageForm.invalid) {
      console.warn('Form is invalid:', this.pageForm.value);
      this.alertService.error('Form is invalid.');
      return;
    }

    // const pageId = page._id;

    const data = {
      pageType: this.pageForm.value.pageType,
      pageName: this.pageForm.value.pageName,
      url: this.pageForm.value.url,
      description: this.pageForm.value.description,
    };

    this.pagesService.editPages(this.pageId, data).subscribe({
      next: (res) => {
        console.log('Page updated successfully:', res);
        this.alertService.success('Page updated successfully!');
        this.getPages?.();
      },
      error: (err) => {
        console.error('Failed to update page:', err);
        this.alertService.error('Failed to update page.');
      },
    });
  }
  getPageDetail(pageId: string): void {
    this.pagesService.getPageDetail(pageId).subscribe({
      next: (res) => {
        this.pageData = res.data;

        console.log('Page Detail:', res);
        this.pageForm.patchValue({
          pageType: res.data.pageType,
          pageName: res.data.pageName,
          url: res.data.url,
          description: '',
        });

        // 👇 store pageName
        this.currentPageName = res.data.pageName;

        console.log('Page Name:', this.currentPageName);
      },
      error: (err) => {
        console.error('Failed to fetch page detail:', err);
      },
    });
  }

  deletePage() {
    console.log('Delete logic here');
    // Delete logic
  }

  goBack(): void {
    this.router.navigate(['/in/insight/editor/pages']);
    console.log('Back button clicked');
  }
}
