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
import { PagesService } from '../pages.service';
import { AlertService } from 'src/app/services/Toaster/alert.service';

declare var bootstrap: any;
@Component({
  selector: 'app-price-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './price-list.component.html',
  styleUrl: './price-list.component.css',
})
export class PriceListComponent {
  sectionForm!: FormGroup;
  groupForm!: FormGroup;
  serviceGroups: any[] = [];
  pageId: string = '';
  sectionId: string = '';
  showSubGroup = false;
  selectedGroup: any = null;
  serviceSUbGroups: any[] = [];

  ngOnInit(): void {
    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
    console.log(this.pageId, ' pageId found');
    this.sectionForm = this.fb.group({
      sectionTitle: ['', Validators.required],
      sectionSubtitle: ['', Validators.required],
    });
    this.groupForm = this.fb.group({
      groupName: ['', Validators.required],
    });
    this.getSectionDetailData();
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private pagesService: PagesService,
    private alertService: AlertService
  ) {}
  backToHomepage() {
    this.router.navigate(['/in/insight/editor/home', this.pageId]);
  }
  openSubGroup(groupId: string) {
    console.log('Clicked groupIdddddddddddddddd:', groupId);

    this.selectedGroup = this.serviceGroups.find((g) => g._id === groupId);

    if (this.selectedGroup) {
      this.serviceSUbGroups = this.selectedGroup.subgroups || [];
    }

    this.showSubGroup = true;
  }

  backToGroupList() {
    this.showSubGroup = false;
    this.selectedGroup = null;
  }

  getSectionDetailData() {
    this.pagesService.GET_SECTION_DETAIL(this.pageId, 'price_list').subscribe({
      next: (res) => {
        console.log('Section detail:', res);
        if (res?.data?.section) {
          this.sectionId = res.data.section._id;

          this.sectionForm.patchValue({
            sectionTitle: res.data.section.sectionTitle || '',
            sectionSubtitle: res.data.section.subtitle || '',
          });
          this.serviceGroups = res.data.section.groups || [];
        }
      },
      error: (err) => {
        console.error('Error loading section detail', err);
      },
    });
  }
  saveSection() {
    if (this.sectionForm.invalid) {
      this.alertService.error('Please fill all required fields');
      return;
    }

    const data = {
      sectionType: 'price_list',
      sectionTitle: this.sectionForm.value.sectionTitle,
      subtitle: this.sectionForm.value.sectionSubtitle,
      pageId: this.pageId,
    };

    this.pagesService.createSection(data).subscribe({
      next: (res) => {
        this.sectionId = res.data._id;
        this.alertService.success('Group added successfully');

        // this.sectionForm.patchValue({ sectionTitle: '', sectionSubtitle: '' });
        this.closeModal();
      },
      error: () => {
        this.alertService.error('Failed to add group');
      },
    });
  }

  addGroup() {
    if (this.groupForm.invalid) {
      this.alertService.error('Group name is required');
      return;
    }

    const groupName = this.groupForm.value.groupName.trim();

    const payload = {
      pageId: this.pageId,
      sectionId: this.sectionId,
      sectionType: 'price_list',
      groupName: groupName,
    };

    this.pagesService.createGroup(payload).subscribe({
      next: (res) => {
        this.alertService.success('Group added successfully');
        this.serviceGroups.push(res.data);
        this.groupForm.reset();
        this.closeModal();
      },
      error: () => {
        this.alertService.error('Failed to add group');
      },
    });
  }
  closeModal(): void {
    const modalEl = document.getElementById('addGroupModal');
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance?.hide();
    }
  }
  navigateToSubgroupForm(pageId: string) {
    this.router.navigate([
      '/in/insight/editor/price-form',
      pageId,
      this.selectedGroup?._id,
    ]);
  }
}
