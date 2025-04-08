import { Routes } from '@angular/router';

import { ContainerComponent } from './commonComponent/container/container.component';
import { DashboardComponent } from './commonComponent/dashboard/dashboard.component';
import { ProtectGuard } from './guards/protect.guard';
import { AuthGuard } from './guards/auth.guard';
import { ForgetPasswordComponent } from './features-module/forget-password/forget-password.component';
import { LoginComponent } from './features-module/login/login.component';
import { ResetPasswordComponent } from './features-module/reset-password/reset-password.component';
import { ChangePasswordComponent } from './features-module/change-password/change-password.component';
import { ProfileComponent } from './features-module/profile/profile.component';
import { SubscriptionManagementComponent } from './features-module/subscription-management/subscription-management.component';
import { ViewUserComponent } from './features-module/user-management/Components/view-user/view-user.component';
import { UkComponent } from './uk/uk.component';
import { CaComponent } from './components/ca/ca.component';
import { UsaComponent } from './components/usa/usa.component';
import { TermsConditionComponent } from './commonComponent/dashboard/terms-condition/terms-condition.component';
import { PrivacyPolicyComponent } from './commonComponent/dashboard/privacy-policy/privacy-policy.component';
import { RefundPolicyComponent } from './commonComponent/dashboard/refund-policy/refund-policy.component';
import { SignUpComponent } from './features-module/sign-up/sign-up.component';

export const routes: Routes = [
  {
    path: 'login',
    // canActivate: [ProtectGuard],
    component: LoginComponent,
  },

  { path: 'signUp', component: SignUpComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: '',
    component: ContainerComponent,
    // canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'in', pathMatch: 'full' },
      { path: 'in', component: DashboardComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'subscription', component: SubscriptionManagementComponent },
      { path: 'uk', component: UkComponent },
      { path: 'ca', component: CaComponent },
      { path: 'us', component: UsaComponent },
      { path: 'in/terms', component: TermsConditionComponent },
      { path: 'in/privacy', component: PrivacyPolicyComponent },
      { path: 'in/refund', component: RefundPolicyComponent },
      {
        path: 'user-management',
        loadChildren: () =>
          import(
            '../app/features-module/user-management/user-management.module'
          ).then((m) => m.UserManagementModule),
      },
      {
        path: 'in/insight',
        loadChildren: () =>
          import('../app/india/dash-board/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'review-management',
        loadChildren: () =>
          import(
            '../app/features-module/review-management/review-management.module'
          ).then((m) => m.ReviewManagementModule),
      },
      {
        path: 'subadmin',
        loadChildren: () =>
          import('../app/features-module/subadmin/subadmin.module').then(
            (m) => m.SubadminModule
          ),
      },
    ],
  },
];
