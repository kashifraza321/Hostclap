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
import { QuillModule } from 'ngx-quill';
import { PagesService } from '../../pages.service';
import { AlertService } from 'src/app/services/Toaster/alert.service';

@Component({
  selector: 'app-new-content',
  standalone: true,
  imports: [
    CommonModule,

    QuillModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
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
  sectionId: string = '';
  sectionType: string = '';
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
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pagesService: PagesService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
    console.log(this.pageId, ' pageId found');
    this.contentBlockForm = this.fb.group({
      title: ['', Validators.required],
      alignment: ['left'],
      fontSize: [this.fontSize, [Validators.min(12), Validators.max(40)]],
      textColour: ['#FF0000'],
      quote: ['', Validators.required],
      image: [null],
    });
    this.getSectionDetailData();
  }

  getSectionDetailData() {
    this.pagesService.GET_SECTION_DETAIL(this.pageId, 'aboutus').subscribe({
      next: (res) => {
        console.log('Full API response:', res);
        if (res?.data?.section) {
          const section = res.data.section;
          this.sectionId = section._id;
          this.sectionType = section.sectionType;

          console.log('sectionId:', this.sectionId);
          console.log('sectionType:', this.sectionType);

          // Patch form values from API
          this.contentBlockForm.patchValue({
            title: section.sectionTitle || '',
            alignment: this.alignment,
            fontSize: this.fontSize,
            textColour: '#FF0000',
            quote: '',
          });
        }
      },
      error: (err) => {
        console.error('Error loading section detail', err);
      },
    });
  }

  // Font size slider change
  updateFontSize(event: Event): void {
    const input = event.target as HTMLInputElement;
    const numericValue = Number(input.value);
    this.fontSize = numericValue;
    this.fontSizeLabel =
      numericValue < 16 ? 'Small' : numericValue < 30 ? 'Medium' : 'Large';
    this.contentBlockForm.patchValue({ fontSize: numericValue });
  }

  // Color picker change
  updateTitleColor(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.contentBlockForm.patchValue({ textColour: input.value });
  }
  // Change alignment
  setAlignment(align: string): void {
    this.alignment = align;
    this.contentBlockForm.patchValue({ alignment: align });
  }
  onMediaSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Check if a file is selected
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.selectedMedia = file;

    // Set the form control value (image) after file selection
    this.contentBlockForm.patchValue({
      image: file, // Set the image file in the form control
    });

    const fileReader = new FileReader();

    // Only allow images to be selected
    if (!file.type.startsWith('image/')) {
      this.mediaPreview = null; // Clear preview if not an image
      return;
    }

    this.mediaPreviewType = 'image';

    fileReader.onload = () => {
      // Set the preview image as the file's data URL
      this.mediaPreview = fileReader.result as string;
    };

    // Read the file as a data URL to show the preview
    fileReader.readAsDataURL(file);
  }

  resetFileInput() {
    const fileInput = document.querySelector(
      '#media-upload'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Resets the file input
    }
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
  performAction(): void {
    console.log('Action button clicked!');
  }

  onSubmit(): void {
    if (this.contentBlockForm.valid) {
      const formData = new FormData();
      const formValue = this.contentBlockForm.value;
      formData.append('pageId', this.pageId);
      formData.append('sectionId', this.sectionId);
      formData.append('sectionType', this.sectionType);

      formData.append('title', formValue.title);
      formData.append('alignment', formValue.alignment);
      formData.append('fontSize', formValue.fontSize.toString());
      formData.append('textColour', formValue.textColour);
      formData.append('quote', formValue.quote);

      if (formValue.image) {
        formData.append('image', formValue.image, formValue.image.name);
      }

      this.pagesService.UpdateAboutus(formData).subscribe({
        next: (res) => {
          console.log(' Success:', res);
          this.alertService.success('Testimonial updated successfully');
        },
        error: (err) => {
          console.error(' Error:', err);
          this.alertService.error('Failed to update testimonial');
        },
      });

      // Example: this.http.post('/api/content', formData).subscribe();
    }
  }
}
