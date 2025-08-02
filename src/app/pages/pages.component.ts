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
  pageForm!: FormGroup;
  // pagesList = [];
  pagesList: any[] = [];
  showHomePage: boolean = false;
  selectedPage: any = null;
  constructor(
    private parent: EditorLayoutComponent,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private pagesService: PagesService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    console.log('User ID ho tm:', this.userId);
    this.getPages();

    this.pageForm = this.fb.group({
      pageType: ['', Validators.required],
      pageName: ['', Validators.required],
      // pageUrl: ['', Validators.required],
    });
  }

  openHomePage(pageId: string) {
    this.router.navigate(['/in/insight/editor/home', pageId]);
  }

  // page change
  // ==============================
  selectedPageIndex: number | null = null;

  togglePage(index: number): void {
    this.selectedPageIndex = this.selectedPageIndex === index ? null : index;
  }

  deletePage(id: string, event: MouseEvent): void {
    event.stopPropagation();
  }

  cancelChanges(): void {
    this.selectedPageIndex = null;
  }

  savePage(page: any): void {}
  getPages() {
    this.pagesService.getPages().subscribe({
      next: (res) => {
        console.log('Fetched pages:', res);

        this.pagesList = res.data?.list || res.data || [];

        console.log(this.pagesList, 'kaleshi afreen');
        // this.data.pageData = this.pagesList;
      },
      error: (err) => {
        console.error('Error loading pages:', err);
        // this.alertService.error("Failed to load pages.");
      },
    });
  }
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
}
