import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagesService } from 'src/app/pages/pages.service';
import { ThemeService } from '../../../theme.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Data } from 'src/app/models/data.model';

@Component({
  selector: 'app-about-us-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us-slider.component.html',
  styleUrl: './about-us-slider.component.css',
})
export class AboutUsSliderComponent {
  currentSlide: number = 0;
  @Input() pageId: any;
  aboutUsSlides: any[] = [];
  slides: any[] = [];
  group:any;
   preview: any = {};
       @Input() data!: Data;
  userId:string=''
  imageUrl: string = environment.imageBaseUrl;
sanitizedQuote: any;
 @Input() isMobilePreview = false;

  // data: any;
  pageData: any;
  isLoading: boolean = false;
dummySlide = {
  title: 'Welcome to Our Company',
  description: 'We are passionate about delivering quality and value.',
  imageUrl: 'assets/images/herosection.png', 
  linkText: 'Learn More',
  link: '#',
  alignment: 'center',
  textColour: '#333333',
  sanitizedDescription: this.sanitizer.bypassSecurityTrustHtml(
    'We are passionate about delivering quality and value.'
  ) as SafeHtml,
};


  constructor(
    private pagesService: PagesService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private themeService: ThemeService
  ) {}
  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('Id') || '';
    console.log('User ID:', this.pageId);

    // Initial backend load.
    this.getSectionDetailData();

    // Live updates: rebuild slides when the About-us editor pushes groups.
    this.pagesService.state$.subscribe((state) => {
      this.preview = state.preview;
      const groups = state?.preview?.aboutus?.groups;
      if (groups?.length) {
        this.buildSlides(groups);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // pageId is provided by the parent and may arrive after ngOnInit.
    if (changes['pageId'] && changes['pageId'].currentValue) {
      this.getSectionDetailData();
    }
  }

  // Shared mapping used by both the backend load and live state updates.
  private buildSlides(groups: any[]) {
    this.slides = (groups || [])
      .filter((group: any) => group.isActive && group.aboutus)
      .map((group: any) => ({
        title: group.aboutus.title || '',
        description: group.aboutus.quote || '',
        imageUrl: this.sanitizer.bypassSecurityTrustUrl(
          this.imageUrl + group.aboutus.imageUrl
        ),
        linkText: 'Learn More',
        link: '#',
        alignment: group.aboutus.alignment || 'left',
        textColour: group.aboutus.textColour || '#000000',
        sanitizedDescription: this.sanitizer.bypassSecurityTrustHtml(
          group.aboutus.quote
        ) as SafeHtml,
      }));

    if (this.slides.length === 0) {
      this.slides = [this.dummySlide];
    }
    this.currentSlide = 0;
  }

  selectSlide(index: number): void {
    this.currentSlide = index;
  }

  moveSlide(direction: number): void {
    const totalSlides = this.slides.length;
    this.currentSlide =
      (this.currentSlide + direction + totalSlides) % totalSlides;
  }

  getPrevIndex(): number {
    return (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  getNextIndex(): number {
    return (this.currentSlide + 1) % this.slides.length;
  }
  getPageDetail(pageId: string): void {
    this.pagesService.getPageDetail(pageId).subscribe({
      next: (res) => {
        this.pageData = res.data;

       

        console.log('Page Detail:', res);
      },
      error: (err) => {
        console.error('Failed to fetch page detail:', err);
        this.isLoading = false;
      },
    });
  }
 getSectionDetailData() {
    if (!this.pageId) {
      return;
    }
    this.pagesService.GET_SECTION_DETAIL(this.pageId, 'aboutus').subscribe({
      next: (res) => {
        const groups = res?.data?.section?.groups || [];
        this.buildSlides(groups);
      },
      error: (err) => {
        console.error('Error loading section detail', err);
         this.slides = [this.dummySlide];
      },
    });
  }


}
