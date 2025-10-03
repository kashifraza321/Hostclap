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
  subgroupId: string = '';
  group: any;
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
    this.subgroupId = this.route.snapshot.paramMap.get('subgroupId') || '';
    this.groupId = this.route.snapshot.paramMap.get('groupId') || '';

    console.log(this.pageId, ' pageId found');
    console.log(this.subgroupId, ' subgroupId found');
    console.log(this.groupId, 'groupId found');

    this.priceItemForm = this.fb.group({
      sectionType: ['price_list', Validators.required],
      subgroupName: ['', Validators.required],
      price: [''],
      showAddToCart: [true],
      description: [''],
    });

    // this.getSectionDetailData();

    if (this.subgroupId) {
      this.getSubGroupDetail(this.subgroupId);
    }
  }

  getSectionDetailData() {
    this.pagesService.GET_SECTION_DETAIL(this.pageId, 'price_list').subscribe({
      next: (res) => {
        console.log('Section detail:', res);
        if (res?.data?.section) {
          this.sectionId = res.data.section._id;

          // Look through the groups to find the relevant subgroupId
          const group = res.data.section.groups?.find(
            (group: { _id: string }) => group._id === this.groupId
          );

          if (group) {
            // Choose the first subgroup (or based on your logic) for the second API call
            const subgroup = group.subgroups[0]; // Adjust this logic to select the correct subgroup
            if (subgroup) {
              this.subgroupId = subgroup._id;
              console.log('Subgroup ID found:', this.subgroupId);

              // Now, call the second API to get the specific subgroup details
              this.getSubGroupDetail(this.subgroupId);
            }
          }
        }
      },
      error: (err) => {
        console.error('Error loading section detail', err);
      },
    });
  }

  getSubGroupDetail(subgroupId: string) {
    this.pagesService.GetSubgroup_Detail(subgroupId).subscribe({
      next: (res) => {
        console.log('Subgroup details:', res);
        if (res?.data) {
          // Assuming res.data contains the necessary details
          const subgroup = res.data;

          // Patching the form with the fetched data
          this.priceItemForm.patchValue({
            subgroupName: subgroup.subgroupName || '',
            price: subgroup.price || '', // Default empty if undefined
            description: subgroup.description || '', // Default empty if undefined
          });

          console.log(
            'Form patched with subgroup data:',
            this.priceItemForm.value
          );
        }
      },
      error: (err) => {
        console.error('Error fetching subgroup details:', err);
        this.alertService.error('Failed to fetch subgroup details.');
      },
    });
  }

  // onSubmit() {
  //   if (this.priceItemForm.valid) {
  //     const formValue = this.priceItemForm.value;

  //     const formData = new FormData();
  //     formData.append('pageId', this.pageId);
  //     formData.append('groupId', this.groupId);
  //     formData.append('sectionType', 'price_list');

  //     formData.append('subgroupName', formValue.subgroupName);
  //     formData.append('price', formValue.price);
  //     formData.append('description', formValue.description);

  //     this.pagesService.CREATE_Sub_GROUP(formData).subscribe({
  //       next: (res) => {
  //         this.alertService.success('Service subgroup created successfully!');
  //       },
  //       error: (err) => {
  //         this.alertService.error('Failed to create service subgroup.');
  //       },
  //     });
  //   }
  // }
  onSubmit() {
    if (this.priceItemForm.valid) {
      const formValue = this.priceItemForm.value;

      const formData = new FormData();
      formData.append('pageId', this.pageId);
      formData.append('groupId', this.groupId);
      formData.append('subgroupId', this.subgroupId);
      formData.append('sectionType', 'price_list');

      formData.append('subgroupName', formValue.subgroupName);
      formData.append('price', formValue.price || '');
      formData.append('description', formValue.description || '');
      formData.append('showAddToCart', formValue.showAddToCart);

      if (this.subgroupId) {
        this.pagesService.UpdateSubgroups(formData).subscribe({
          next: (res) => {
            this.alertService.success('Service subgroup updated successfully!');
            this.back(this.pageId);
          },
          error: () => {
            this.alertService.error('Failed to update service subgroup.');
          },
        });
      } else {
        // CREATE subgroup
        this.pagesService.CREATE_Sub_GROUP(formData).subscribe({
          next: (res) => {
            this.alertService.success('Service subgroup created successfully!');
            this.back(this.pageId);
          },
          error: () => {
            this.alertService.error('Failed to create service subgroup.');
          },
        });
      }
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
