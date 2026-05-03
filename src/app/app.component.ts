import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpcommanService } from './services/httpshared.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './services/auth.service';
import { LoginService } from './services/login.service';
import { Subscription } from 'rxjs';
import { HeaderComponent } from './commonComponent/header/header.component';
import { InsightHeaderComponent } from './india/dash-board/dashboard/insight-board/components/insight-header/insight-header.component';
import { FooterComponent } from './commonComponent/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    // TODO: `HttpClientModule` should not be imported into a component directly.
    // Please refactor the code to add `provideHttpClient()` call to the provider list in the
    // application bootstrap logic and remove the `HttpClientModule` import from this component.
    HttpClientModule,
    HeaderComponent,
    InsightHeaderComponent,
    FooterComponent,
  ],
  providers: [HttpcommanService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Hostclap';
  isLoggedIn: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private loginService: LoginService) {}

  ngOnInit() {
    this.subscription.add(
      this.loginService.isLoggedIn$.subscribe((status) => {
        this.isLoggedIn = status;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
