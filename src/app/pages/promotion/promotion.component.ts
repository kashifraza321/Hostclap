import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { PagesService } from '../pages.service';
import { AlertService } from 'src/app/services/Toaster/alert.service';
import { CommonModule } from '@angular/common';
import { merge, tap } from 'rxjs';

@Component({
  selector: 'app-promotion',
  standalone: true,
  imports: [
    QuillModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './promotion.component.html',
  styleUrl: './promotion.component.css',
})
export class PromotionComponent {
  promotionForm!: FormGroup;
  pageId: string = '';
  pageData: any;

  editorModules = {
    toolbar: '#custom-toolbar',
  };

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ color: [] }], // color picker
      [{ size: ['small', false, 'large', 'huge'] }],
      ['link'],
      [{ list: 'bullet' }, { list: 'ordered' }],
      [{ header: [false, 1, 2] }],
      [{ align: [] }],
    ],
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private pagesService: PagesService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this.promotionForm = this.fb.group({
      title: [''],
      description: [''],
    });

    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';

    merge(
      this.promotionForm.valueChanges.pipe(
        tap((val) =>
          // this.pagesService.updatePreviewSection('announcement', val)

          this.updatePromotionPreview()
        )
      )
    ).subscribe();
    this.getPageData();
  }

  updatePromotionPreview() {
    const data = {
      title: this.promotionForm.get('title')?.value || '',
      description: this.promotionForm.get('description')?.value || '',
    };
    this.pagesService.updatePreviewSection('offer', data);
    console.log('Promotion live preview:', data);
  }

  backToHomepage() {
    this.router.navigate(['/in/insight/editor/home', this.pageId]);
  }

  savePromotion() {
    if (this.promotionForm.invalid) {
      this.alertService.error('Form is invalid.');
      return;
    }

    const payload = {
      offer: this.promotionForm.value,
    };

    console.log(payload, 'payload before API');

    this.pagesService.editPages(this.pageId, payload).subscribe({
      next: (res) => {
        console.log('Promotion updated successfully:', res);
        this.alertService.success('Promotion updated successfully!');
        this.getPageData();
      },
      error: (err) => {
        console.error('Failed to update promotion:', err);
        this.alertService.error('Failed to update promotion.');
      },
    });
  }
  getPageData(): void {
    this.pagesService.getPageDetail(this.pageId).subscribe({
      next: (res) => {
        if (res?.status === 200) {
          console.log('Full API Response:', res);

          const offerData = res.data?.offer;
          console.log('Offer data from API:', offerData);

          if (offerData) {
            this.promotionForm.patchValue({
              title: offerData.title || '',
              description: offerData.description || '',
            });

            console.log('Form value after patch:', this.promotionForm.value);
          }
        }
      },
      error: (err) => {
        console.error('API Error:', err);
      },
    });
  }
}
