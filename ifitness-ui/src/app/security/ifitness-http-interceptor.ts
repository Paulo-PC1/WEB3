import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class IfitnessHttpInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // 1. Se for Login ou Refresh, passa direto sem mexer
    if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh') || req.url.includes('/users')) {
      return next.handle(req);
    }

    // 2. Verifica se o token precisa ser renovado ANTES da requisição
    if (this.auth.isInvalidAccessToken()) {
      return from(this.auth.getNewAccessToken()).pipe(
        mergeMap(() => {
          // O token foi renovado e salvo no localStorage.
          // Agora recuperamos e anexamos à requisição.
          const newToken = localStorage.getItem('token');
          const authReq = this.addTokenHeader(req, newToken);
          return next.handle(authReq);
        }),
        // É importante tratar erros aqui. Se o refresh falhar, desloga o usuário.
        catchError((error) => {
            return throwError(() => error);
        })
      );
    }

    // 3. Adicionar o header antes de enviar.
    const token = localStorage.getItem('token');
    const authReq = this.addTokenHeader(req, token);

    return next.handle(authReq);
  }

  private addTokenHeader(req: HttpRequest<any>, token: string | null): HttpRequest<any> {
    if (!token) {
        return req;
    }
    return req.clone({
      // Adiciona o cabeçalho Authorization
        setHeaders: {
            Authorization: `Bearer ${token}`
        },
        // Adiciona a flag para enviar Cookies junto com a requisição
        withCredentials: true
    });
  }
}
