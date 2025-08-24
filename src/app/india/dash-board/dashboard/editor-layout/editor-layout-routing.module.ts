import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorLayoutComponent } from './components/editor-layout/editor-layout.component';
import { EditorSidebarComponent } from './components/editor-sidebar/editor-sidebar.component';
import { ThemeComponent } from './components/theme/theme/theme.component';
import { PagesComponent } from 'src/app/pages/pages.component';
import { TemplateHeaderComponent } from 'src/app/pages/template-header/template-header.component';
import { HomePageComponent } from 'src/app/pages/home-page/home-page.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SectionsComponent } from './components/sections/sections.component';
import { TemplateServicesComponent } from 'src/app/pages/template-services/template-services.component';
import { TemplateGalleryComponent } from 'src/app/pages/template-gallery/template-gallery.component';
import { TemplateAmenitiesComponent } from 'src/app/pages/template-amenities/template-amenities.component';
import { GoogleReviewsComponent } from 'src/app/pages/google-reviews/google-reviews.component';
import { ContactUsComponent } from 'src/app/pages/contact-us/contact-us.component';
import { OpeningHoursComponent } from 'src/app/pages/opening-hours/opening-hours.component';
import { PriceListComponent } from 'src/app/pages/price-list/price-list.component';
import { PromotionComponent } from 'src/app/pages/promotion/promotion.component';
import { TemplateFooterComponent } from 'src/app/pages/template-footer/template-footer.component';
import { TemplateContactFormComponent } from 'src/app/pages/template-contact-form/template-contact-form.component';

const routes: Routes = [
  {
    path: '',
    component: EditorLayoutComponent,
    children: [
      {
        path: '',
        component: EditorSidebarComponent, // show sidebar by default
      },
      { path: 'theme', component: ThemeComponent },
      { path: 'pages', component: PagesComponent },
      { path: 'home/:pageId', component: HomePageComponent },
      {
        path: 'header/:pageId',
        component: TemplateHeaderComponent,
      },
      {
        path: 'services/:pageId',
        component: TemplateServicesComponent,
      },
      {
        path: 'gallery',
        component: TemplateGalleryComponent,
      },
      {
        path: 'amenities/:pageId',
        component: TemplateAmenitiesComponent,
      },
      {
        path: 'reviews',
        component: GoogleReviewsComponent,
      },
      {
        path: 'contact-us/:pageId',
        component: ContactUsComponent,
      },
      {
        path: 'opening-hours',
        component: OpeningHoursComponent,
      },
      {
        path: 'price-list',
        component: PriceListComponent,
      },
      {
        path: 'Promotion/:pageId',
        component: PromotionComponent,
      },
      {
        path: 'template-footer/:pageId',
        component: TemplateFooterComponent,
      },
      {
        path: 'contact-form/:pageId',
        component: TemplateContactFormComponent,
      },
      { path: 'sections', component: SectionsComponent },
      { path: 'settings', component: SettingsComponent },
      // { path: '', redirectTo: 'theme', pathMatch: 'full' }, // optional default
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditorLayoutRoutingModule {}
