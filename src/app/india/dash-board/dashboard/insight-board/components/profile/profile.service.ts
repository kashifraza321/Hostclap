import { Injectable } from '@angular/core';
import { API_CONSTANTS } from 'src/app/Constants/api.constant';
import { HttpcommanService } from 'src/app/services/httpshared.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private httpService: HttpcommanService) {}
  getProfile() {
    return this.httpService.getCall(
      `${API_CONSTANTS.GET_PROFILE}/6839deb7022d885d575d9880`
    );
  }
}
