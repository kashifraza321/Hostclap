import { Injectable } from '@angular/core';
import { API_CONSTANTS } from 'src/app/Constants/api.constant';
import { HttpcommanService } from 'src/app/services/httpshared.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(private httpService: HttpcommanService) {}
  saveTheme(themeData: any) {
    return this.httpService.postCall(`${API_CONSTANTS.GET_THEME}`, themeData);
  }
  getTheme() {
    return this.httpService.getCall(`${API_CONSTANTS.GET_WEBSITE}`);
  }
}
