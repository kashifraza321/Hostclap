import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-content',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './new-content.component.html',
  styleUrl: './new-content.component.css',
})
export class NewContentComponent {
  contentBlockForm!: FormGroup;
  alignment: string = 'left'; // Default alignment
  fontSize: number = 16; // Default font size (Medium)
  fontSizeLabel: string = 'Medium';
  selectedMedia: File | null = null;
  mediaPreview: string | null = null;
  mediaPreviewType: 'image' | 'video' | null = null;
  pageId: string = '';
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
    console.log(this.pageId, ' pageId found');
    this.contentBlockForm = this.fb.group({
      title: ['', Validators.required],
      alignment: ['left'],
      fontSize: [this.fontSize, [Validators.min(12), Validators.max(40)]],
      color: ['#FF0000'],
      text: ['', Validators.required],
      media: [null],
    });
  }

  // Font size slider change
  updateFontSize(value: string): void {
    const numericValue = Number(value);
    this.fontSize = numericValue;
    this.fontSizeLabel =
      numericValue < 16 ? 'Small' : numericValue < 30 ? 'Medium' : 'Large';
    this.contentBlockForm.patchValue({ fontSize: numericValue });
  }

  // Color picker change
  updateTitleColor(color: string): void {
    this.contentBlockForm.patchValue({ color });
  }

  // Change alignment
  setAlignment(align: string): void {
    this.alignment = align;
    this.contentBlockForm.patchValue({ alignment: align });
  }
  onMediaSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.selectedMedia = file;
    this.contentBlockForm.patchValue({ media: file });

    const fileReader = new FileReader();

    if (file.type.startsWith('image/')) {
      this.mediaPreviewType = 'image';
    } else if (file.type.startsWith('video/')) {
      this.mediaPreviewType = 'video';
    } else {
      this.mediaPreviewType = null;
      this.mediaPreview = null;
      return;
    }

    fileReader.onload = () => {
      this.mediaPreview = fileReader.result as string;
    };
    fileReader.readAsDataURL(file);
  }
  // Cancel (reset form)
  cancelChanges(): void {
    this.contentBlockForm.reset({
      title: '',
      alignment: 'left',
      fontSize: 16,
      color: '#FF0000',
      text: '',
    });
    this.alignment = 'left';
    this.fontSize = 16;
    this.fontSizeLabel = 'Medium';
  }
  backTo(pageId: string) {
    this.router.navigate(['/in/insight/editor/about-us', this.pageId]);
  }
  // Submit form
  onSubmit(): void {
    if (this.contentBlockForm.valid) {
      const formData = new FormData();
      const formValue = this.contentBlockForm.value;

      formData.append('title', formValue.title);
      formData.append('alignment', formValue.alignment);
      formData.append('fontSize', formValue.fontSize.toString());
      formData.append('color', formValue.color);
      formData.append('text', formValue.text);

      if (formValue.media) {
        formData.append('media', formValue.media);
      }

      // Now, this FormData can be posted to backend
      console.log('FormData ready for submission');

      // Example: this.http.post('/api/content', formData).subscribe();
    }
  }
}
