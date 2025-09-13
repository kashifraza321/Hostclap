import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EditorLayoutComponent } from '../india/dash-board/dashboard/editor-layout/components/editor-layout/editor-layout.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertService } from '../services/Toaster/alert.service';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { PagesService } from './pages.service';
// import { PagesService } from './pages.service';
declare var bootstrap: any;

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    HomePageComponent,
    RouterModule,
  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css',
})
export class PagesComponent {
  userId: string = '';
  pageId: string = '';
  pageForm!: FormGroup;
  inlineForm!: FormGroup;
  // pagesList = [];
  isSectionVisible = false;
  pagesList: any[] = [];
  showHomePage: boolean = false;
  selectedPage: any = null;
  pageData: any;
  constructor(
    private parent: EditorLayoutComponent,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private pagesService: PagesService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    // this.userId = this.route.snapshot.paramMap.get('id') || '';
    // console.log('User ID ho tm:', this.userId);
    this.userId = localStorage.getItem('userId') || '';
    console.log('User ID from localStorage:', this.userId);
    this.getPages();
    console.log('page._id being senttttttttttttt:', this.pageId);

    this.pageForm = this.fb.group({
      pageType: ['', Validators.required],
      pageName: ['', Validators.required],
      // pageUrl: ['', Validators.required],
    });
    this.inlineForm = this.fb.group({
      pageName: ['', Validators.required],
      url: ['', Validators.required],
      pageType: ['', Validators.required],
    });
  }
  toggleSection(event: Event) {
    const input = event.target as HTMLInputElement;
    this.isSectionVisible = input.checked;
  }
  openHomePage(pageId: string) {
    this.router.navigate(['/in/insight/editor/home', pageId]);
  }

  // page change
  // ==============================
  selectedPageIndex: number | null = null;

  togglePage(index: number): void {
    const selectedPage = this.pagesList[index];
    console.log('Clicked index:', index, 'Selected Page:', selectedPage);

    if (!selectedPage) return;
    if (selectedPage.pageType === 'blank') {
      console.log('Blank page detected, navigating to /merchant-policy');
      this.router.navigate([
        '/in/insight/editor/merchant-policy',
        selectedPage._id,
      ]);
      return;
    }
    if (this.selectedPageIndex === index) {
      this.selectedPageIndex = null;
    } else {
      this.selectedPageIndex = index;

      const selectedPage = this.pagesList[index];
      if (selectedPage) {
        this.inlineForm.patchValue({
          pageName: selectedPage.pageName || '',
          url: selectedPage.url || '',
          pageType: selectedPage.pageType || '',
        });
      }
    }
  }
  deletePage(pageId: string, event: MouseEvent): void {
    event.stopPropagation();

    if (!confirm('Are you sure you want to delete this page?')) {
      return;
    }
    // const pageId = page._id;
    this.pagesService.deletePages(pageId).subscribe({
      next: (res) => {
        console.log(' Page deleted successfully:', res);
        this.alertService.success('Page deleted successfully!');
        this.getPages();
      },
      error: (err) => {
        console.error(' Failed to delete page:', err);
        this.alertService.error('Failed to delete page.');
      },
    });
  }

  cancelChanges(): void {
    this.selectedPageIndex = null;
    this.inlineForm.reset();
  }
  // Save inline edited page

  saveInlinePage(page: any): void {
    if (this.inlineForm.invalid) {
      console.warn('Form is invalid:', this.inlineForm.value);
      this.alertService.error('Form is invalid.');
      return;
    }

    const pageId = page._id;

    const data = {
      pageType: this.inlineForm.value.pageType,
      pageName: this.inlineForm.value.pageName,
      url: this.inlineForm.value.url,
    };

    this.pagesService.editPages(pageId, data).subscribe({
      next: (res) => {
        console.log(' Page updated successfully:', res);
        this.alertService.success('Page updated successfully!');
        this.getPages();
        this.selectedPageIndex = null;
      },
      error: (err) => {
        console.error(' Failed to update page:', err);
        this.alertService.error('Failed to update page.');
      },
    });
  }
  // // Delete page (basic structure only)
  // deletePage(id: string, event: MouseEvent): void {
  //   event.stopPropagation();
  //   // optional: call delete API
  // }
  getPages() {
    this.pagesService.getPages().subscribe({
      next: (res) => {
        console.log('Fetched pages:', res);

        this.pagesList = res.data?.list || res.data || [];
        this.pageId = this.pagesList.length > 0 ? this.pagesList[0]._id : null;
        console.log(this.pageId, 'pageid in pages');
        if (this.pageId) {
          this.getPageDetail(this.pageId);
        }

        console.log(this.pagesList, 'kaleshi afreen');
        // this.data.pageData = this.pagesList;
      },
      error: (err) => {
        console.error('Error loading pages:', err);
        // this.alertService.error("Failed to load pages.");
      },
    });
  }
  // Add Page modal submit
  onSubmit() {
    console.log('Submit triggered');
    console.log(this.pageForm.value);
    console.log(this.pageForm.valid);
    if (this.pageForm.valid) {
      const pageData = {
        ...this.pageForm.value,
        // userId: this.userId,
      };

      this.pagesService.createPages(pageData).subscribe({
        next: (res) => {
          this.alertService.success('Page created successfully!');
          console.log('Page created:', res);
          // alert("Page created successfully!");
          this.pageForm.reset();

          const modalEl = document.getElementById('pageModal');
          if (modalEl) {
            const modal =
              bootstrap.Modal.getInstance(modalEl) ||
              new bootstrap.Modal(modalEl);
            modal.hide();
            this.pagesService.getPages().subscribe((response: any) => {
              const list = response?.data?.list || response?.data || [];
              console.log(' Updated pages fetched', list);
              // this.pagesService.setPages(list);
              this.pagesList = list;
            });
          }
          this.getPages();
        },
        error: (err) => {
          console.error('Error creating page:', err);
          // alert("Failed to create page");
        },
      });
    } else {
      console.warn('Form invalid ', this.pageForm.value);
    }
  }

  goBack() {
    this.router.navigateByUrl('/in/insight/editor');
  }
  // get page detail
  getPageDetail(pageId: string): void {
    this.pagesService.getPageDetail(pageId).subscribe({
      next: (res) => {
        this.pageData = res.data;

        console.log('Page Detail:', res);
        console.log(this.pageData.phones.mobile, 'mobileeeee');
      },
      error: (err) => {
        console.error('Failed to fetch page detail:', err);
      },
    });
  }
  getIconForPage(type: string): string {
    switch (type) {
      case 'link':
        return '../../assets/images/icons8-link-50.png';
      case 'profile':
        return '../../assets/images/icons8-profiles-50.png';
      case 'home':
        return '../../assets/images/icons8-home-50 (1).png';
      case 'faq':
        return '../../assets/images/icons8-faq-50.png';
      case 'media':
        return '../../assets/images/icons8-media-80.png';
      case 'spaces':
        return '../../assets/images/icons8-blank-50.png';
      default:
        return '../../assets/images/icons8-space.png';
    }
  }
}
