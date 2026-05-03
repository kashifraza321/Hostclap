import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from '../services/Toaster/alert.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private alertService: AlertService,
    private authService: AuthService
  ) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    };

    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    request = request.clone({ setHeaders: headers });

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = error.error?.message || error.statusText || '';
        const lowerMessage = typeof message === 'string' ? message.toLowerCase() : '';
        const isJwtExpired =
          error.status === 410 &&
          (lowerMessage.includes('jwt') || lowerMessage.includes('token has expired') || lowerMessage.includes('expired'));

        if (error.status === 401 || isJwtExpired) {
          localStorage.removeItem('token');
          this.alertService.warning('Your session has expired. Please login again.');
          this.authService.logout();
        }

        return throwError(() => error);
      })
    );
  }
}
