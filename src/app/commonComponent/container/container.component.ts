import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from '../../../Module/material.module';
import { LoginService } from '../../services/login.service';
import { environment } from '../../../environments/environment';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [
    HeaderComponent,
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
  styleUrl: './container.component.scss',
})
export class ContainerComponent implements OnInit {
  isHalfShown: boolean = false;
  toggle: boolean = false;
  imageUrl = environment.imageUrl;
  defaultUser = 'assets/images/user.avif';

  @Output() dataEvent = new EventEmitter<boolean>();

  constructor(private loginService: LoginService) {}

  private carousel: any;

  ngOnInit() {
    this.getProfileDetails();
  }

  receiveData(data: boolean): void {
    this.isHalfShown = data;
    this.toggle = this.isHalfShown;
  }

  getValue() {
    this.dataEvent.emit(this.isHalfShown);
  }
  profileDetailsData: any;
  getProfileDetails() {
    this.loginService.getAdminDetails().subscribe((res: any) => {
      if (res) {
        if (res?.data?.profilePic) {
          this.profileDetailsData = `${this.imageUrl}${res.data.profilePic}`;
        }
      }
    });
  }

  ngAfterViewInit() {
    this.carousel = document.querySelector('#cardCarousel');
  }

  pauseSlider() {
    this.carousel?.carousel?.('pause');
  }

  startSlider() {
    this.carousel?.carousel?.('cycle');
  }
}
