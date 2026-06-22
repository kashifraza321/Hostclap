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
  // True once backend data has loaded; guards the live-preview push so early
  // edits don't overwrite backend services with empty data.
  private dataLoaded = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private pagesService: PagesService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
    console.log(this.pageId, ' pageId found');
    this.sectionForm = this.fb.group({
      sectionTitle: ['', Validators.required],
      subtitle: ['', Validators.required],
    });
    this.groupForm = this.fb.group({
      groupName: ['', Validators.required],
    });
    this.getSectionDetailData();
     this.pagesService.triggerScroll('service');

    // Mirror edits to the preview only after backend data has loaded, so the
    // first keystroke doesn't push empty groups and wipe the service cards.
    this.sectionForm.valueChanges.subscribe((val) => {
      if (!this.dataLoaded) {
        return;
      }
      this.applyServiceChanges(val);
    });
  }

  backToHomepage() {
    this.router.navigate(['/in/insight/editor/home', this.pageId]);
  }

  openSubGroup(groupId: string) {
    console.log('Clicked groupId:', groupId);

    this.selectedGroup = this.serviceGroups.find((g) => g._id === groupId);

    if (this.selectedGroup) {
      this.serviceSUbGroups = this.selectedGroup.subgroups || [];
    }
     this.sectionForm.patchValue({
    groupName: this.selectedGroup?.groupName
  });


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
            subtitle: res.data.section.subtitle || '',
          }, { emitEvent: false });
          this.serviceGroups = res.data.section.groups || [];
           this.applyServiceChanges(this.sectionForm.value);
        }
        this.dataLoaded = true;
      },
      error: (err) => {
        console.error('Error loading section detail', err);
        this.dataLoaded = true;
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
      subtitle: this.sectionForm.value.subtitle,
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
applyServiceChanges(val: any) {

  if (this.showSubGroup) {
    return; // Group edit ke time section title update mat karo
  }

  this.pagesService.updatePreviewSection('service', {
    sectionTitle: val.sectionTitle,
    subtitle: val.subtitle,
    groups: [...this.serviceGroups]
  });
}
// applyServiceChanges(val: any) {
//   const currentService = this.pagesService.getCurrentService() || {
//     sectionTitle: '',
//     subtitle: '',
//     groups: [],
//     subgroups: [],
//   };

//   const data = {
//     ...currentService,
//     sectionTitle: val.sectionTitle || '',
//     subtitle: val.subtitle || '',
//   };

//   console.log('Before update:', currentService);
//   this.pagesService.updatePreviewSection('service', data);
//   console.log('Sending to updatePreviewSection:', data);
// }



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
          const newGroup = res.data; 
        this.serviceGroups.push(res.data);
        this.serviceSUbGroups.push(res.data);
        this.applyServiceChanges(this.sectionForm.value);
     
  // 🔥 Realtime Preview
  
  this.pagesService.updatePreviewSection('service', {
    sectionTitle: this.sectionForm.value.sectionTitle,
    subtitle: this.sectionForm.value.subtitle,
    groups: [...this.serviceGroups]
  });

      // //  Right preview me update (realtime)
      // const currentServices = this.pagesService.getCurrentServices();
      // this.pagesService.updateServices([...currentServices, newGroup]);
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
  //  deleteGroup(subgroupId: string, sectionType: string) {
  //   console.log(sectionType, 'pricelist sectiontype');
  //   this.pagesService.deleteServiesBlock(sectionType, subgroupId).subscribe({
  //     next: (res) => {
  //       console.log('Group deleted:', res);
  //       this.alertService.success('Group deleted successfully');
  //         this.getSectionDetailData();

  //       // Remove from UI list
  //       this.serviceSUbGroups = this.serviceSUbGroups.filter(
  //         (g) => g._id !== subgroupId
  //       );
  //     },
  //     error: (err) => {
  //       console.error('Error deleting group:', err);
  //       this.alertService.error('Failed to delete group');
  //     },
  //   });
  // }
  deleteGroup(subgroupId: string, sectionType: string) {
  this.pagesService.deleteServiesBlock(sectionType, subgroupId).subscribe({
    next: (res) => {
      this.alertService.success('Group deleted successfully');

      // GET API hit
      this.pagesService
        .GET_SECTION_DETAIL(this.pageId, 'service')
        .subscribe({
          next: (response) => {
            this.serviceGroups = response?.data?.section?.groups || [];
            this.applyServiceChanges(this.sectionForm.value);

            // agar subgroup screen open hai to uska loop bhi refresh karo
            if (this.selectedGroup?._id) {
              const updatedGroup = this.serviceGroups.find(
                (g) => g._id === this.selectedGroup._id
              );

              this.serviceSUbGroups = updatedGroup?.subgroups || [];

              // selectedGroup bhi update kar do
              this.selectedGroup = updatedGroup;
            }
          },
        });
    },

    error: (err) => {
      console.error(err);
      this.alertService.error('Failed to delete group');
    },
  });
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
