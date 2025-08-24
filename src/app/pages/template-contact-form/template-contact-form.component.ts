import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PagesService } from '../pages.service';
import { AlertService } from 'src/app/services/Toaster/alert.service';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-template-contact-form',
  standalone: true,
  imports: [
    QuillModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './template-contact-form.component.html',
  styleUrl: './template-contact-form.component.css',
})
export class TemplateContactFormComponent {
  contactUsForm!: FormGroup;
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
    this.contactUsForm = this.fb.group({
      title: ['Send Us a Message', Validators.required],
      titleVisible: [true],
      subtitle: ['Our team will respond within 24 hours'],
      warningText: ['Please provide a valid email address'],
    });
    this.pageId = this.route.snapshot.paramMap.get('pageId') || '';
  }

  backToHomepage() {
    this.router.navigateByUrl('/in/insight/editor/pages');
  }
  saveContactUs() {
    if (this.contactUsForm.invalid) {
      this.alertService.error('Form is invalid.');
      return;
    }

    const payload = {
      offer: this.contactUsForm.value,
    };

    console.log(payload, 'payload before API');

    this.pagesService.editPages(this.pageId, payload).subscribe({
      next: (res) => {
        console.log('Promotion updated successfully:', res);
        this.alertService.success('Promotion updated successfully!');
      },
      error: (err) => {
        console.error('Failed to update promotion:', err);
        this.alertService.error('Failed to update promotion.');
      },
    });
  }
}
