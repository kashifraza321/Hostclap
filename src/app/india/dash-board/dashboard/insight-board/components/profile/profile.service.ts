import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { API_CONSTANTS } from 'src/app/Constants/api.constant';
import { HttpcommanService } from 'src/app/services/httpshared.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private httpService: HttpcommanService,
    private http: HttpClient
  ) {}
  getProfile(userId: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.httpService.getCall(`${API_CONSTANTS.GET_PROFILE}/${userId}`);
  }
  updateProfile(payload: any) {
    return this.httpService.patchCall(`${API_CONSTANTS.EDIT_PROFILE}`, payload);
  }

  // updateProfile(payload: any): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //     'Content-Type': 'application/json',
  //   });

  //   return this.http.patch(API_CONSTANTS.EDIT_PROFILE, payload, { headers });
  // }
}
