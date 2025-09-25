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
  selectedFiles: File[] = [];
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
    console.log(this.pageId, ' pageId found');
    console.log(this.groupId, ' groupId found');

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

    this.getSectionDetailData();
  }

  onFileChange(event: any) {
    // Get selected files and store them in selectedFiles array
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files); // Save selected files
    }
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
