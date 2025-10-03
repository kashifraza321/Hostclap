import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagesService } from 'src/app/pages/pages.service';
import { ThemeService } from '../../../theme.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-about-us-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us-slider.component.html',
  styleUrl: './about-us-slider.component.css',
})
export class AboutUsSliderComponent {
  currentSlide: number = 0;
  userId: string = '';
  data: any;
  pageData: any;
  isLoading: boolean = false;

  slides = [
    {
      image: 'assets/images/girlimg.jpeg',
      title: 'Wedding Makeup Artist Ranchi',
      description: `Welcome to Zoe Makeup Artist, your trusted wedding makeup artist in Ranchi. At Zoe, we understand that your wedding day is a momentous occasion, and we are here to ensure you look nothing short of stunning on your special day.`,
      linkText: 'Learn More',
      link: '#',
    },
    {
      image: 'assets/images/twogrils.png',
      title: 'Engagement Makeup Services',
      description: `Get flawless makeup for your engagement ceremony. We craft looks that enhance your natural beauty while staying photo-ready all day.`,
      linkText: 'Explore Engagement Looks',
      link: '#',
    },
    {
      image: 'assets/images/shoppinggirl.png',
      title: 'Reception Glam',
      description: `Your reception deserves a stunning makeover too. Our glamorous looks are perfect for your reception night celebrations.`,
      linkText: 'See Reception Styles',
      link: '#',
    },
    {
      image: 'assets/images/image4.jpg',
      title: 'Pre-Wedding Shoots',
      description: `We specialize in natural, soft glam makeup ideal for pre-wedding shoots. Highlight your best features with camera-ready artistry.`,
      linkText: 'Book a Session',
      link: '#',
    },
  ];
  constructor(
    private pagesService: PagesService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private themeService: ThemeService
  ) {}
  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    console.log('User ID:', this.userId);

    // this.pagesService.state$.subscribe((state) => {
    //   this.preview = state.preview;
    // });

    this.GetWebsiteTheme();
    // this.getPageDetail('687177a9aa11a48cb4de77db');
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
