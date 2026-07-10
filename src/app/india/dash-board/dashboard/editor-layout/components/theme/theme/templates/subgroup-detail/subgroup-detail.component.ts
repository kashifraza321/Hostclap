import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderComponent } from 'src/app/commonComponent/loader/loader.component';
import { Data } from 'src/app/models/data.model';
import { PagesService } from 'src/app/pages/pages.service';
import { environment } from 'src/environments/environment';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'app-subgroup-detail',
  standalone: true,
  imports: [  LoaderComponent,CommonModule],
  templateUrl: './subgroup-detail.component.html',
  styleUrl: './subgroup-detail.component.css'
})
export class SubgroupDetailComponent {
   isLoading = false;
    @Input() data!: Data;
  @Input() slug!: string;
  @Input() pageId!: string;


  userId: string = '';

   previewData: any = {};
  pages: any[] = [];
  pagesList: any[] = [];
  preview: any = {};
  state: any;
  serviceData:any
    pageData: any;
    imgurl = environment.imageBaseUrl;
   public state$ = this.pagesService.state$;
    scrollListenerAttached = false;
    subgroupData: any;
    isScrolled = false;
   @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
constructor( private cdr: ChangeDetectorRef,
   private pagesService: PagesService,
    private route: ActivatedRoute,
       private sanitizer: DomSanitizer,
        private router: Router,
    private themeService: ThemeService,
){}
  ngOnChanges(changes: SimpleChanges) {
   if (changes['slug']) {
  this.loadSubgroup();
}

  }
 ngOnInit() {
  this.slug = this.route.snapshot.paramMap.get('slug') || '';
  this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
  console.log('Slug:', this.slug, 'Page ID:', this.pageId);
 
 
  console.log('ngOnInit - data received:', this.data);
 
  console.log('paGEIDDDD ID:', this.pageId);

    this.pagesService.state$.subscribe((state) => {
      this.preview = state.preview;
    });
    this.getPages()
     console.log('SubgroupDetailComponent Slug:', this.slug);
  this.loadSubgroup();
    
  }
  ngAfterViewChecked() {
    if (this.scrollContainer && !this.scrollListenerAttached) {
      this.scrollContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
      this.scrollListenerAttached = true;
    
    }
  }
   onScroll(event?: Event) {
   
    // Example: toggle isScrolled based on scrollTop
    const scrollTop = this.scrollContainer.nativeElement.scrollTop;
    this.isScrolled = scrollTop > 50;
    this.cdr.detectChanges(); // ensure Angular picks up the change
  }

    GetWebsiteTheme() {
    this.themeService.getTheme().subscribe({
      next: (response) => {
        if (response.data) {
          this.data = {
            ...this.data,
            ...response.data,
          };
          console.log('Merged theme data:', this.data);
        }
      },
      error: (err) => {
        console.error('Error fetching theme:', err);
      },
    });
  }

  getPages() {
    this.isLoading = true;
    this.pagesService.getPages().subscribe({
      next: (res) => {
        console.log('Fetched pages:', res);

        this.pagesList = res.data || [];
        this.pageId = res.data[0]?._id;
        if (this.pageId) {
          this.getPageDetail(this.pageId);
          this.getSectionDetailData(this.pageId);
      
        }

      
        this.data = { ...this.data, pageData: this.pagesList };
       
      },
      error: (err) => {
        console.error('Error loading pages:', err);
      },
      complete: () => {
        this.isLoading = false; // loader stop
      },
    });
  }
  getPageDetail(pageId: string): void {
    this.pagesService.getPageDetail(pageId).subscribe({
      next: (res) => {
        this.pageData = res.data;

        console.log(this.pageData.contactUs.title, 'mobileeeee');

        console.log('Page Detail:', res);
      
        
      },
      error: (err) => {
        console.error('Failed to fetch page detail:', err);
        this.isLoading = false;
      },
    });
  }
    getLogoUrl(): SafeUrl {
      // console.log(this.pageData?.header?.logo?.image, 'logooooooo img');
  
      if (
        (this.preview?.logo?.image &&
          typeof this.pageData?.header?.logo?.image === 'object') ||
        typeof this.preview?.logo?.image === 'string'
      ) {
        return this.sanitizer.bypassSecurityTrustUrl(this.preview.logo.image);
      }
  
      if (this.pageData?.header?.logo?.image) {
        return this.sanitizer.bypassSecurityTrustUrl(
          this.imgurl + this.pageData.header.logo.image
        );
      }
  
      return 'assets/images/default-logo.png';
    }
     getFullAddress(): string {
    const address = this.pageData?.contactUs?.address || '';
    const state = this.pageData?.contactUs?.state || '';
    const zip = this.pageData?.contactUs?.zip || '';
    const country = this.pageData?.contactUs?.country || '';
    return `${address}, ${state}, ${zip}, ${country}`;
  }

  getGoogleMapsUrl(address: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
  }
    scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

   loadSubgroup() {
     console.log('Loading subgroup for:', this.slug, this.pageId);
    this.pagesService.GetSubgroupBySlug(this.slug).subscribe({
      next: (res) => {
        this.subgroupData = res.data;
        console.log('Subgroup loaded:', res);
        console.log(this.imgurl + this.subgroupData.media?.[0]);

      },
      error: (err) => {
        console.error('Error loading subgroup:', err);
      }
    });
  }

      getSectionDetailData(pageId: string) {
    this.pagesService.GET_SECTION_DETAIL(pageId, 'service').subscribe({
      next: (res) => {
        this.serviceData = res.data;
        console.log('Section detail:', res);
      
      },
      error: (err) => {
        console.error('Error loading section detail', err);
      },
    });
  }
  getSanitizedImageUrl(path: string): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(this.imgurl + path);
}
}
