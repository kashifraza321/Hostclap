import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PagesService } from '../pages.service';
import { AlertService } from 'src/app/services/Toaster/alert.service';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-template-gallery',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './template-gallery.component.html',
  styleUrl: './template-gallery.component.css',
})
export class TemplateGalleryComponent {
  galleryForm!: FormGroup;
  selectedFiles: { file: File | null; preview: string }[] = [];
  pageId: string = '';
  pageData: any;
  imgurl = environment.imageBaseUrl;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private pagesService: PagesService,
    private alertService: AlertService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
    console.log(this.pageId, ' pageId found');
    this.galleryForm = this.fb.group({
      pageId: [this.pageId],
      title: ['SERVICE'],
      titleVisible: [true],
      subtitle: ['Get AC Service Now'],
      images: this.fb.array([]),
    });
    this.getPageDetail(this.pageId);
  }
  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      for (let file of event.target.files) {
        const previewUrl = URL.createObjectURL(file);
        this.selectedFiles.push({ file, preview: previewUrl });
      }
    }
  }

  removeImage(index: number): void {
    URL.revokeObjectURL(this.selectedFiles[index].preview);
    this.selectedFiles.splice(index, 1);
  }

  removeAll(): void {
    this.selectedFiles.forEach((img) => URL.revokeObjectURL(img.preview));
    this.selectedFiles = [];
  }

  backToHomepage() {
    this.router.navigateByUrl('/in/insight/editor/pages');
  }
  getPageDetail(pageId: string): void {
    this.pagesService.getPageDetail(pageId).subscribe({
      next: (res) => {
        this.pageData = res.data;
        const gallery = res.data.gallery;
        console.log('Gallery:', gallery);

        console.log('Page Detail:', res);
        this.galleryForm.patchValue({
          title: gallery.title,
          subtitle: gallery.subtitle,
        });
        this.selectedFiles = (gallery.images || []).map((imgPath: string) => {
          const fullUrl = this.imgurl.endsWith('/')
            ? this.imgurl + imgPath
            : this.imgurl + '/' + imgPath;

          // Use sanitizer to bypass Angular security
          const safeUrl: SafeUrl =
            this.sanitizer.bypassSecurityTrustUrl(fullUrl);

          console.log('Image Path:', imgPath);
          console.log('Full preview URL:', fullUrl);

          return {
            preview: safeUrl,
            file: null,
          };
        });

        console.log('Selected files:', this.selectedFiles);
      },
      error: (err) => {
        console.error('Failed to fetch page detail:', err);
      },
    });
  }

  saveGallery(): void {
    if (!this.galleryForm.valid) return;

    const formData = new FormData();
    formData.append('pageId', this.galleryForm.value.pageId);
    formData.append('title', this.galleryForm.value.title);
    formData.append('titleVisible', this.galleryForm.value.titleVisible);
    formData.append('subtitle', this.galleryForm.value.subtitle);

    this.selectedFiles.forEach((item) => {
      if (item.file) {
        formData.append('images', item.file);
      }
    });

    this.pagesService.updateGallery(formData).subscribe({
      next: (res) => {
        this.alertService.success('Gallery updated successfully!');
      },
      error: (err) => {
        this.alertService.error('Failed to update gallery.');
      },
    });
  }
}
