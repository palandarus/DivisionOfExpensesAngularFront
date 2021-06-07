import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from '../user/shared/services/auth.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private auth: AuthService,
        private router: Router
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.auth.isAuthenticated()) {
            req = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token')),
                setParams: {
                    auth: this.auth.token
                }
            });
        }
        return next.handle(req)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    console.log('[Interceptor Error]: ', error);
                    if (error.status === 401) {
                        this.auth.logout();
                        this.router.navigate(['/user', 'login'], {
                            queryParams: {
                                authFailed: true
                            }
                        });
                    }
                    return throwError(error);
                })
            );
    }
}
