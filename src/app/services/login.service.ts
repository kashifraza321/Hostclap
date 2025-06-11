import { Injectable } from '@angular/core';
import { HttpcommanService } from './httpshared.service';
import { API_CONSTANTS } from '../Constants/api.constant';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  public isLoggedIn$ = new BehaviorSubject<boolean>(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  constructor(private httpService: HttpcommanService) {}
  setLoginStatus(status: boolean) {
    console.log('[LoginService] Setting login status:', status);
    localStorage.setItem('isLoggedIn', String(status));
    this.isLoggedIn$.next(status);
  }

  login(data: any) {
    return this.httpService.postCall(`${API_CONSTANTS.LOGIN_URL}`, data);
  }
  signup(data: any) {
    return this.httpService.postCall(`${API_CONSTANTS.SIGN_UP}`, data);
  }

  changePassword(data: any) {
    return this.httpService.postCall(`${API_CONSTANTS.CHANGE_PASSWORD}`, data);
  }

  getAdminDetails() {
    return this.httpService.getCall(`${API_CONSTANTS.ADMIN_DETAILS}`);
  }

  editAdminProfile(data: any) {
    return this.httpService.patchCall(
      `${API_CONSTANTS.EDIT_PROFILE_DETAILS}`,
      data
    );
  }

  getDashboardDetails() {
    return this.httpService.getCall(`${API_CONSTANTS.DASHBOARD_DETAILS}`);
  }

  forgetPassword(data: any) {
    return this.httpService.postCall(`${API_CONSTANTS.FORGET_PASSWORD}`, data);
  }

  resetPassword(data: any, token: string) {
    return this.httpService.resetAdminPassword(
      `${API_CONSTANTS.RESET_PASSWORD}`,
      token,
      data
    );
  }
}
