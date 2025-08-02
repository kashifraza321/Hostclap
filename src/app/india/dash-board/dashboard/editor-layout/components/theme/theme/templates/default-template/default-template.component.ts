import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Data } from 'src/app/models/data.model';
import { PagesService } from 'src/app/pages/pages.service';

@Component({
  selector: 'app-default-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './default-template.component.html',
  styleUrl: './default-template.component.css',
})
export class DefaultTemplateComponent {
  @Input() data!: Data;
  userId: string = '';
  pagesList = [];
  constructor(
    private pagesService: PagesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    console.log('User ID:', this.userId);
    this.getPages();
  }
  getPages() {
    this.pagesService.getPages().subscribe({
      next: (res) => {
        console.log('Fetched pages:', res);
        this.pagesList = res.data || [];
        console.log(this.pagesList, 'tazzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
        // this.data.pageData = this.pagesList;
        // this.parent.updateData({ pageData: this.pagesList });
        this.data = { ...this.data, pageData: this.pagesList };
        console.log(this.data.pageData, 'ffffffffffffffffffffff');
      },
      error: (err) => {
        console.error('Error loading pages:', err);
      },
    });
  }
}
