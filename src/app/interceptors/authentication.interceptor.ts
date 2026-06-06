// import { Injectable } from '@angular/core';
// import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
// import { Observable, catchError, throwError } from 'rxjs';
// import { Router } from '@angular/router';
// import { AlertService } from '../services/Toaster/alert.service';

// @Injectable()
// export class AuthenticationInterceptor implements HttpInterceptor {

//   constructor(
//     private router: Router,
//     private alertService: AlertService
//   ) { }

//   intercept(
//     request: HttpRequest<unknown>,
//     next: HttpHandler
//   ): Observable<HttpEvent<unknown>> {
//     let token = localStorage.getItem("token");

//     if (token) {
//       request = request.clone({
//         setHeaders: { Authorization: "Bearer " + token },
//       });
//       // return next.handle(httpRequest);
//     }
//     return next.handle(request).pipe(
//       catchError((error: HttpErrorResponse) => {
//         // this.alertService.info(error.error?.message);
//         if (error.status == 401) {
//           // localStorage.clear();
//           localStorage.removeItem("token");
//           // return throwError(error)
//           this.router.navigate(["/login"]);
//         }
//         return throwError(error);
//       })
//     );
//   }
// }
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from '../services/Toaster/alert.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private alertService: AlertService
  ) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let token = localStorage.getItem("token");

    if (token) {
      request = request.clone({
        setHeaders: { Authorization: "Bearer " + token },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 410) {
          localStorage.removeItem("token");
          const message = error.error.details || 'Session expired, please login again';
          this.alertService.warning(message);
          console.log(message);
          window.alert(message); 
          // this.router.navigate(["/login"]);
        }
        return throwError(error);
      })
    );
  }
}
