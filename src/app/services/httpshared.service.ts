import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  HttpClient,
  HttpEvent,
  HttpErrorResponse,
  HttpEventType,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from './Toaster/alert.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpcommanService {
  baseUrl = environment.apiUrl;
  mobileBaseUrl = environment.apiUrl;

  //baseUrl = environment.baseUrlLocalhost;
  constructor(
    private _http: HttpClient,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  postCall(routeUrl: string, data: any): Observable<any> {
    return this._http
      .post<any>(`${this.baseUrl}${routeUrl}`, data)
      .pipe(catchError((error) => this.handleError(error)));
  }

  postMobileCall(routeUrl: string, data: any): Observable<any> {
    return this._http
      .post<any>(`${this.mobileBaseUrl}${routeUrl}`, data)
      .pipe(catchError((error) => this.handleError(error)));
  }
  getCall(routeUrl: string, noCache: boolean = false): Observable<any> {
    const options = noCache
      ? {
          headers: new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          }),
        }
      : {};
    return this._http
      .get<any>(`${this.baseUrl}${routeUrl}`, options)
      .pipe(catchError((error) => this.handleError(error)));
  }

  putCall(routeUrl: string, data: any): Observable<any> {
    return this._http
      .put<any>(`${this.baseUrl}${routeUrl}`, data)
      .pipe(catchError((error) => this.handleError(error)));
  }

  patchCall(
    routeUrl: string,
    data: any,
    isFormData: boolean = false
  ): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      // 'Content-Type': 'application/json',
    });
    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }

    return this._http
      .patch<any>(`${this.baseUrl}${routeUrl}`, data, {
        headers,
      })
      .pipe(catchError((error) => this.handleError(error)));
  }
  deleteCall(routeUrl: string, id: any): Observable<any> {
    return this._http
      .delete<any>(`${this.baseUrl}${routeUrl}/${id}`)
      .pipe(catchError((error) => this.handleError(error)));
  }
  // deleteCall(id: any): Observable<any> {
  //   return this._http.delete<any>(`${this.baseUrl}/${id}`);
  // }

  resetAdminPassword(routeUrl: string, token: any, data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this._http
      .post<any>(`${this.baseUrl}${routeUrl}`, data, {
        headers: headers,
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: any): Observable<never> {
    const status = error?.status;
    const message = error?.error?.message || error?.message || error?.statusText;
    const lowerMessage = typeof message === 'string' ? message.toLowerCase() : '';

    const isJwtExpired =
      status === 410 &&
      (lowerMessage.includes('jwt') || lowerMessage.includes('token has expired') || lowerMessage.includes('expired'));

    if (status === 401 || isJwtExpired) {
      this.alertService.warning('Your session has expired. Please login again.');
      this.authService.logout();
      return throwError(() => error);
    }

    let errMsg = 'An unexpected error occurred.';
    if (error?.error) {
      if (typeof error.error === 'string') {
        errMsg = error.error;
      } else if (error.error.message) {
        errMsg = error.error.message;
      }
    } else if (error?.message) {
      errMsg = error.message;
    } else if (error?.status) {
      errMsg = `Server returned code ${error.status}: ${error.statusText || 'Unknown error'}`;
    }

    this.alertService.error(errMsg);
    return throwError(() => error);
  }
}
