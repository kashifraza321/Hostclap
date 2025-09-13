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
import { AlertService } from 'src/app/services/Toaster/alert.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pricelist-sub-group-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, QuillModule],
  templateUrl: './pricelist-sub-group-form.component.html',
  styleUrl: './pricelist-sub-group-form.component.css',
})
export class PricelistSubGroupFormComponent {
  priceItemForm!: FormGroup;
  pageId: string = '';
  groupId: string = '';
  sectionId: string = '';
  serviceSUbGroups: any[] = [];
  categories = ['categrory one  ', 'electronics', 'clothes', 'toys'];
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
    console.log(this.pageId, ' pageId found');
    this.groupId = this.route.snapshot.paramMap.get('groupId') || '';
    console.log(this.groupId, ' groupId found');
    this.priceItemForm = this.fb.group({
      sectionType: ['price_list', Validators.required],
      subgroupName: ['', Validators.required],
      price: [''],
      showAddToCart: [true],
      description: [''],
    });
    this.getSectionDetailData();
  }

  getSectionDetailData() {
    this.pagesService.GET_SECTION_DETAIL(this.pageId, 'price_list').subscribe({
      next: (res) => {
        console.log('Section detail:', res);
        if (res?.data?.section) {
          this.sectionId = res.data.section._id;

          // Agar subgroupName patch karna ho
          if (
            res.data.section.groups?.length > 0 &&
            res.data.section.groups[0].subGroups?.length > 0
          ) {
            const firstSubgroup = res.data.section.groups[0].subGroups[0];
            this.priceItemForm.patchValue({
              subgroupName: firstSubgroup.subgroupName || '',
            });
          }
        }
      },
      error: (err) => {
        console.error('Error loading section detail', err);
      },
    });
  }

  onSubmit() {
    if (this.priceItemForm.valid) {
      const formValue = this.priceItemForm.value;

      const formData = new FormData();
      formData.append('pageId', this.pageId);
      formData.append('groupId', this.groupId);
      formData.append('sectionType', 'price_list');

      formData.append('subgroupName', formValue.subgroupName);
      formData.append('price', formValue.price);
      formData.append('description', formValue.description);

      this.pagesService.CREATE_Sub_GROUP(formData).subscribe({
        next: (res) => {
          this.alertService.success('Service subgroup created successfully!');
        },
        error: (err) => {
          this.alertService.error('Failed to create service subgroup.');
        },
      });
    }
  }

  onCancel() {
    console.log('Form cancelled');
    this.priceItemForm.reset();
  }
  back(pageId: string) {
    this.router.navigate(['/in/insight/editor/price-list', this.pageId]);
  }
}
