import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { PagesService } from '../../pages.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/Toaster/alert.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, QuillModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent {
  productForm!: FormGroup;
  pageId: string = '';
  groupId: string = '';
  sectionId: string = '';
  subgroupId: string = '';
  selectedFiles: File[] = [];
  selectedMedia: File | null = null;
  mediaPreview: string | null = null;
  mediaPreviewType: 'image' | 'video' | null = null;
  categories = ['Electronics', 'Clothes', 'Toys'];
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
    private pagesService: PagesService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
    this.groupId = this.route.snapshot.paramMap.get('groupId') || '';
    this.subgroupId = this.route.snapshot.paramMap.get('subgroupId') || '';
    console.log(this.pageId, ' pageId found');
    console.log(this.groupId, ' groupId found');
    console.log(this.subgroupId, ' subgroupId found');

    // Initialize the form group for product creation
    this.productForm = this.fb.group({
      subgroupName: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      unit: ['', [Validators.required, Validators.min(1)]],
      promotionalPrice: ['', Validators.min(0)],
      description: ['', Validators.required], // Quill editor's description field
      media: [null],
      showAddToCart: [true],
      category: ['', Validators.required],
      productVariants: [false], // Add this if applicable
      inventory: [true], // Stock toggle
      productTags: [''], // Tags field
    });

    if (this.subgroupId) {
      this.getSubGroupDetail(this.subgroupId);
    }
  }

  onMediaSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.selectedMedia = file;

    this.productForm.patchValue({
      image: file,
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
  getSubGroupDetail(subgroupId: string) {
    this.pagesService.GetSubgroup_Detail(subgroupId).subscribe({
      next: (res) => {
        console.log('Subgroup details:', res);
        if (res?.data) {
          // Assuming res.data contains the necessary details
          const subgroup = res.data;

          // Patching the form with the fetched data
          this.productForm.patchValue({
            subgroupName: subgroup.subgroupName || '',
            price: subgroup.price || '',
            description: subgroup.description || '',
            unit: subgroup.unit || '',
            promotionPrice: subgroup.promotionPrice || '',
          });

          console.log(
            'Form patched with subgroup data:',
            this.productForm.value
          );
        }
      },
      error: (err) => {
        console.error('Error fetching subgroup details:', err);
        this.alertService.error('Failed to fetch subgroup details.');
      },
    });
  }
  // Fetch section details if needed
  getSectionDetailData() {
    this.pagesService.GET_SECTION_DETAIL(this.pageId, 'products').subscribe({
      next: (res) => {
        console.log('Section detail:', res);
        if (res?.data?.section) {
          this.sectionId = res.data.section._id;

          // Optionally patch data if available (example for sub-group, can be adapted)
        }
      },
      error: (err) => {
        console.error('Error loading section detail', err);
      },
    });
  }

  // Form submission
  onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const formData = new FormData();

      formData.append('pageId', this.pageId);
      formData.append('groupId', this.groupId);
      formData.append('sectionType', 'price_list');
      formData.append('subgroupName', formValue.subgroupName);
      formData.append('price', formValue.price);
      formData.append('unit', formValue.unit);
      formData.append('promotionalPrice', formValue.promotionalPrice);
      formData.append('description', formValue.description);
      formData.append('category', formValue.category);
      formData.append('showAddToCart', formValue.showAddToCart);

      // Append media files (from selectedFiles array)
      if (this.selectedFiles.length > 0) {
        this.selectedFiles.forEach((file) => {
          formData.append('media', file, file.name); // Append each selected file
        });
      }

      // Send the FormData with all fields, including files
      this.pagesService.CREATE_Sub_GROUP(formData).subscribe({
        next: (res) => {
          this.alertService.success('Product created successfully!');
        },
        error: (err) => {
          this.alertService.error('Failed to create product.');
        },
      });
    }
  }

  onCancel() {
    this.productForm.reset();
  }
  // Navigate back
  back(pageId: string) {
    this.router.navigate(['/in/insight/editor/products', this.pageId]);
  }
}
