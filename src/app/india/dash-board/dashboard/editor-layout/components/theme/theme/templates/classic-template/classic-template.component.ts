import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Data } from 'src/app/models/data.model';
import { PagesService } from 'src/app/pages/pages.service';

@Component({
  selector: 'app-classic-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './classic-template.component.html',
  styleUrl: './classic-template.component.css',
})
export class ClassicTemplateComponent {
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
  aboveContactSections: any[] = [];
  belowContactSections: any[] = [];
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50; // 50px scroll ke baad class lag jayegi
  }
  constructor(
    private pagesService: PagesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    console.log('User ID:', this.userId);

    console.log('User ID:', this.userId);
    console.log('Page ID:', this.pageId);

    // this.pagesService.state$.subscribe((state) => {
    //   this.pages = state.pages;
    //   this.preview = state.preview;
    // });
    // this.pagesService.state$.subscribe((state) => {
    //   this.previewData = state.preview;
    // });
    // this.pagesService.state$.subscribe((state) => {
    //   console.log('preview data', state.preview.titles);
    // });
    this.pagesService.state$.subscribe((state) => {
      this.preview = state.preview;
    });
    this.getPages();

    // this.getPageDetail('687177a9aa11a48cb4de77db');
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
          this.getSectionDetailData(this.pageId);
          console.log(this.pageData.phones.mobile, 'mobileeeee');
          console.log(this.getSectionDetailData, 'gettttttttttt');
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
        console.log(this.pageData.contactUs.title, 'mobileeeee');

        console.log('Page Detail:', res);
        console.log(this.pageData.phones.mobile, 'mobileeeee');
      },
      error: (err) => {
        console.error('Failed to fetch page detail:', err);
      },
    });
  }
  getSectionDetailData(pageId: string) {
    this.pagesService.GET_SECTION_DETAIL(pageId).subscribe({
      next: (res) => {
        this.serviceData = res.data;
        console.log('Section detail:', res);
        this.aboveContactSections = res.data?.section?.groups || [];
      },
      error: (err) => {
        console.error('Error loading section detail', err);
      },
    });
  }
}
