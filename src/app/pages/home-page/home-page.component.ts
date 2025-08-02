import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TemplateHeaderComponent } from '../template-header/template-header.component';
import { PagesService } from '../pages.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TemplateHeaderComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  homeForm!: FormGroup;
  userId: string = '';
  showHeader = false;
  selectedSection: string = 'home';
  pageId: string = '';
  pageData: any;
  pages: any[] = [];
  sections: { name: string; key: string }[] = [];

  pageForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pagesService: PagesService
  ) {}

  ngOnInit() {
    this.pageId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Page ID:', this.pageId);

    this.homeForm = this.fb.group({
      pageName: ['Home'],
      isActive: [true],
    });
    this.sections = [
      { name: 'Header', key: 'header' },
      { name: 'Banner', key: 'banner' },
      { name: 'About Us', key: 'about' },
      { name: 'About Us', key: 'about' },
      { name: 'About Us', key: 'about' },
    ];

    console.log('Sections list cnsdcndscnd:', this.sections);
    console.log('✅ Sections Initialized:', this.sections);
    console.log('✅ selectedSection:', this.selectedSection);
    this.getPageData();
  }
  // openSection(section: string) {
  //   this.selectedSection = section;
  // }

  addSection(): void {
    console.log('Add Section Clicked');
  }

  editSections(): void {
    console.log('Edit Clicked');
  }

  selectSection(key: string) {
    this.selectedSection = key;
  }
  goBack() {
    this.router.navigateByUrl('/in/insight/editor/pages');
  }
  openHeader(pageId: string) {
    this.router.navigate(['/in/insight/editor/header', pageId]);
  }
  openSection(key: string) {
    this.router.navigate(['/in/insight/editor', key]);
  }
  onSectionClick(section: { name: string; key: string }) {
    if (section.key === 'header') {
      this.openHeader(this.pageId);
    } else {
      console.log(`Section clicked: ${section.name} (Not implemented)`);
    }
  }

  // openSection(section: string) {
  //   console.log('Opening section:', section);
  //   this.selectedSection = section;
  // }
  onSubmit() {}

  getPageData(): void {
    this.pagesService.getPageDetail(this.pageId).subscribe({
      next: (res) => {
        if (res?.status === 200) {
          console.log('Full API Response:', res);
          this.pageData = res.data;

          console.log('Page Data:', this.pageData);
        }
      },
      error: (err) => {
        console.error('API Error:', err);
      },
    });
  }
}
