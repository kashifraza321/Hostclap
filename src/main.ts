import { bootstrapApplication } from '@angular/platform-browser';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers, // Include other providers from appConfig
    provideCharts(withDefaultRegisterables()), provideCharts(withDefaultRegisterables()), // Add ng2-charts configuration
  ],
}).catch((err) => console.error(err));
