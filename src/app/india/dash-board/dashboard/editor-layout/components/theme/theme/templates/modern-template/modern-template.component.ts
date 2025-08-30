import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagesService } from 'src/app/pages/pages.service';
import { Data } from 'src/app/models/data.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modern-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modern-template.component.html',
  styleUrl: './modern-template.component.css',
})
export class ModernTemplateComponent {
  @Input() data!: Data;
  userId: string = '';
  pageId: string = '';
  pagesList: any[] = [];
  previewData: any = {};
  pages: any[] = [];
  preview: any = {};
  sectionId: string = '';
  pageData: any;

  serviceData: any;
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  public state$ = this.pagesService.state$;
  isScrolled = false;
  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;
  constructor(
    private pagesService: PagesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    console.log('User ID:', this.userId);
    this.pagesService.state$.subscribe((state) => {
      this.preview = state.preview;
    });
    this.getPages();
    this.getPageDetail('687177a9aa11a48cb4de77db');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.addEventListener('scroll', () => {
          const scrollTop = this.scrollContainer.nativeElement.scrollTop;
          this.isScrolled = scrollTop > 50;
          console.log('Scroll:', scrollTop, 'isScrolled:', this.isScrolled);
        });
      } else {
        console.error('scrollContainer still not found after timeout!');
      }
    }, 0);
  }

  getPages() {
    this.pagesService.getPages().subscribe({
      next: (res) => {
        console.log('Fetched pages:', res);
        this.pagesList = res.data || [];
        console.log(this.pagesList, 'tazzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
        // this.data.pageData = this.pagesList;
        // this.parent.updateData({ pageData: this.pagesList });
        this.data = { ...this.data, pageData: this.pagesList };
        console.log(this.data.pageData, 'ffffffffffffffffffffff');
      },
      error: (err) => {
        console.error('Error loading pages:', err);
      },
    });
  }
  getPageDetail(pageId: string): void {
    this.pagesService.getPageDetail(pageId).subscribe({
      next: (res) => {
        this.pageData = res.data;

        console.log('Page Detail:', res);
        if (this.pageId) {
          this.getPageDetail(this.pageId);
          console.log(this.pageData.phones.mobile, 'mobileeeee');
        }
        console.log(this.pageData.phones.mobile, 'mobileeeee');
      },
      error: (err) => {
        console.error('Failed to fetch page detail:', err);
      },
    });
  }
}
