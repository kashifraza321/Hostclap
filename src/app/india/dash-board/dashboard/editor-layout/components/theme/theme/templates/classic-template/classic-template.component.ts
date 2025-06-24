import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Data } from 'src/app/models/data.model';

@Component({
  selector: 'app-classic-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './classic-template.component.html',
  styleUrl: './classic-template.component.css',
})
export class ClassicTemplateComponent {
  @Input() data!: Data;
}
