import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PagesService } from '../pages.service';
import { AlertService } from 'src/app/services/Toaster/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-footer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './template-footer.component.html',
  styleUrl: './template-footer.component.css',
})
export class TemplateFooterComponent {
  footerForm!: FormGroup;
  pageId: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pagesService: PagesService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.footerForm = this.fb.group({
      tagline: [''],
      logo: [''],
      branding: [true],
    });

    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // 🔹 Show preview before upload
      const reader = new FileReader();
      reader.onload = () => {
        this.footerForm.patchValue({ logo: reader.result as string });
      };
      reader.readAsDataURL(file);

      // 🔹 Upload file to server
      const formData = new FormData();
      formData.append('file', file);

      // this.pagesService.uploadFile(formData).subscribe({
      //   next: (res: any) => {
      //     // assume API returns { url: 'https://example.com/logo.png' }
      //     this.footerForm.patchValue({ logo: res.url });
      //     this.alertService.success('Logo uploaded successfully!');
      //   },
      //   error: (err) => {
      //     console.error('Upload failed:', err);
      //     this.alertService.error('Failed to upload logo.');
      //   },
      // });
    }
  }
  uploadLogo() {}

  // 👇 Remove Logo
  removeLogo() {
    // this.footerForm.patchValue({ logo: '' });
  }

  saveFooter() {
    if (this.footerForm.invalid) {
      this.alertService.error('Form is invalid.');
      return;
    }

    const payload = {
      footer: this.footerForm.value,
    };

    this.pagesService.editPages(this.pageId, payload).subscribe({
      next: (res) => {
        console.log('Footer updated successfully:', res);
        this.alertService.success('Footer updated successfully!');
      },
      error: (err) => {
        console.error('Failed to update footer:', err);
        this.alertService.error('Failed to update footer.');
      },
    });
  }
  backToHomepage() {
    this.router.navigateByUrl('/in/insight/editor/pages');
  }
}
