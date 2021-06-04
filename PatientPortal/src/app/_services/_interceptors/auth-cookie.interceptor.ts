import { Observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

//this http request interceptor is used only in development mode
//because our client application can be deployed separately from web API
@Injectable()
export class AuthCookieInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isProductionEnv = environment.production
        if (!isProductionEnv) {
            request = request.clone({
                withCredentials: true
            });
        }
        return next.handle(request);
    }
}