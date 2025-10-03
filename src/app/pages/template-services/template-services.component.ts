import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/Toaster/alert.service';
import { PagesService } from '../pages.service';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;
@Component({
  selector: 'app-template-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './template-services.component.html',
  styleUrl: './template-services.component.css',
})
export class TemplateServicesComponent {
  sectionForm!: FormGroup;
  groupForm!: FormGroup;
  serviceGroups: any[] = [];
  serviceSUbGroups: any[] = [];
  pageId: string = '';
  sectionId: string = '';
  showSubGroup = false;
  selectedGroup: any = null;
  isSubgroupPage = false;

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
    console.log('Clicked groupId:', groupId);

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
  backToGroups() {}

  getSectionDetailData() {
    this.pagesService.GET_SECTION_DETAIL(this.pageId, 'service').subscribe({
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
      sectionType: 'service',
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
      sectionType: 'service',
      groupName: groupName,
    };

    this.pagesService.createGroup(payload).subscribe({
      next: (res) => {
        this.alertService.success('Group added successfully');
        this.serviceGroups.push(res.data);
        this.serviceSUbGroups.push(res.data);
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
  // navigateToSubgroupForm(pageId: string) {
  //   this.router.navigate([
  //     '/in/insight/editor/form',
  //     pageId,
  //     this.selectedGroup?._id,
  //   ]);
  // }
  navigateToSubgroupForm(pageId: string, groupId: string, subgroupId?: string) {
    if (subgroupId) {
      // Editing existing
      this.router.navigate([
        '/in/insight/editor/form',
        pageId,
        groupId,
        subgroupId,
      ]);
    } else {
      // Creating new
      this.router.navigate(['/in/insight/editor/form', pageId, groupId]);
    }
  }
}
