import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from '../../../Module/material.module';
import { FooterComponent } from '../footer/footer.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    RouterModule,
    NgxPaginationModule,
    MaterialModule,
    FooterComponent,
  ],
  providers: [
    {
      provide: ActivatedRoute,
      useValue: {},
    },
  ],
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent implements OnInit {
  showLayout = true;

  @Output() dataEvent = new EventEmitter<boolean>();

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // ✅ Agar editor page hai to header/footer hide kar do
        this.showLayout = !event.urlAfterRedirects.includes('/editor');
      });
  }

  ngOnInit() {
    console.log('Container Loaded');
  }

  receiveData(data: boolean): void {
    // This might be used by sidebar or something
  }

  getValue() {
    this.dataEvent.emit(false); // or whatever
  }
}
