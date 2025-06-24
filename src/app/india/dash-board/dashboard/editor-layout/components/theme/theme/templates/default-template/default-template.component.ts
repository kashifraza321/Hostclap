import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Data } from 'src/app/models/data.model';

@Component({
  selector: 'app-default-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './default-template.component.html',
  styleUrl: './default-template.component.css',
})
export class DefaultTemplateComponent {
  @Input() data!: Data;
}
