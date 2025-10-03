import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
// import { Data } from '@angular/router';
import { Data } from 'src/app/models/data.model';
import { PagesService } from 'src/app/pages/pages.service';
import { ThemeService } from '../../../theme.service';

@Component({
  selector: 'app-review-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-slider.component.html',
  styleUrl: './review-slider.component.css',
})
export class ReviewSliderComponent {
  currentIndex = 0;
  @Input() data!: Data;
  pageData: any;
  isLoading = false;
  userId: string = '';

  reviews = [
    {
      text: 'Huge shoutout to Zoe and team, for making me feel so beautiful 💖 ...',
      date: 'Jul 2, 2025',
      rating: 5,
      name: 'Sis Tee',
      initial: 'S',
    },
    {
      text: 'Thnkyou soo soo much Zoe for the amazing makeup for my nikah...',
      date: 'Jun 26, 2025',
      rating: 5,
      name: 'Arshi Saniya',
      initial: 'A',
    },
    {
      text: 'Loved the experience with Aziza and the team...',
      date: 'May 20, 2025',
      rating: 5,
      name: 'Avni Mohan',
      initial: 'A',
    },
    {
      text: 'Best makeup artist in Ranchi nowadays. Such a kind nature she has...',
      date: 'May 15, 2025',
      rating: 5,
      name: 'Anshika Sahay',
      initial: 'A',
    },
    {
      text: 'Best makeup artist in Ranchi nowadays. Such a kind nature she has...',
      date: 'May 15, 2025',
      rating: 5,
      name: 'Anshika Sahay',
      initial: 'A',
    },
    {
      text: 'Best makeup artist in Ranchi nowadays. Such a kind nature she has...',
      date: 'May 15, 2025',
      rating: 5,
      name: 'Anshika Sahay',
      initial: 'A',
    },
    {
      text: 'Best makeup artist in Ranchi nowadays. Such a kind nature she has...',
      date: 'May 15, 2025',
      rating: 5,
      name: 'Anshika Sahay',
      initial: 'A',
    },
  ];
  constructor(
    private pagesService: PagesService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService
  ) {}
  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    console.log('User ID:', this.userId);
    console.log('ngOnInit - data received:', this.data);

    console.log('User ID:', this.userId);
    this.GetWebsiteTheme();

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
    // this.getPageDetail(pageID)
    // this.pagesService.state$.subscribe((state) => {
    //   this.preview = state.preview;
    // });
    // this.getPages();
  }

  next() {
    if (this.currentIndex < this.reviews.length - 3) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
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
}
