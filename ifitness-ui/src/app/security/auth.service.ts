import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  oauthTokenUrl = 'http://localhost:8080/auth/login';
  refreshTokenUrl = 'http://localhost:8080/auth/refresh';
  logoutUrl = 'http://localhost:8080/auth/logout';
  jwtPayload: any;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    this.loadToken();
  }

  async login(user: string, password: string): Promise<void> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = {
      "username": user,
      "password": password
    };

    try {
      const response: any = await firstValueFrom(
        this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
      );
      console.log(response);
      this.storeToken(response['accessToken']);
        } catch (response: any) {
      if (response.status === 400 && response.error === 'invalid_grant') {
        return Promise.reject('Usuário e/ou senha inválida!');
      }
      return Promise.reject(response);
    }
  }

  private storeToken(token: string): void {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private loadToken(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.storeToken(token);
    }
  }

  async getNewAccessToken(): Promise<void> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = {};

    try {
      const response: any = await firstValueFrom(
        this.http.post(this.refreshTokenUrl, body, { headers, withCredentials: true })
      );
      console.log('Novo access token criado!');
      this.storeToken(response['accessToken']);
    } catch (response: any) {
      if (response.status === 400 && response.error === 'invalid_grant') {
        return Promise.reject('Erro ao renovar token.');
      }
      return Promise.reject(response);
    }
  }

  isInvalidAccessToken(): boolean {
    const token = localStorage.getItem('token');

    return !token || this.jwtHelper.isTokenExpired(token);
  }
  
  async logout(): Promise<void> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = {};

    try {
      const response: any = await firstValueFrom(
        this.http.post(this.logoutUrl, body, { headers, withCredentials: true })
      );
      console.log(response);
      this.storeToken(response['accessToken']);
    } catch (response: any) {
      return Promise.reject(response);
    } finally {
      localStorage.removeItem('token');
    }
  }
}