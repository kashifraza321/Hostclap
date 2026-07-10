import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Data } from 'src/app/models/data.model';
import { PagesService } from 'src/app/pages/pages.service';

@Component({
  selector: 'app-default-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './default-template.component.html',
  styleUrl: './default-template.component.css',
})
export class DefaultTemplateComponent {
  @Input() data!: Data;
  userId: string = '';
  pageId: string = '';
  // pagesList = [];
  pages: any[] = [];
  preview: any = {};
  pagesList: any[] = [];
  public state$ = this.pagesService.state$;
  previewData: any = {};
  pageData: any;
  constructor(
    private pagesService: PagesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId') || '';
    console.log('User ID from localStorage:', this.userId);
    this.pagesService.state$.subscribe((state) => {
      this.pages = state.pages;
      this.preview = state.preview;
    });
    this.getPages();
    this.getPageDetail('687177a9aa11a48cb4de77db');
  }

  getPages() {
    this.pagesService.getPages().subscribe({
      next: (res) => {
        console.log('Fetched pages:', res);
        this.pagesList = res.data || [];
        this.pageId = res.data[0]?._id;

        console.log(this.pageId, 'pageid yaha s nikal lun');
        console.log(this.pagesList, 'tazzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
        if (this.pageId) {
          this.getPageDetail(this.pageId);
          console.log(this.pageData.phones.mobile, 'mobileeeee');
        }
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
        console.log(this.pageData.phones.mobile, 'mobileeeee');
      },
      error: (err) => {
        console.error('Failed to fetch page detail:', err);
      },
    });
  }
}
