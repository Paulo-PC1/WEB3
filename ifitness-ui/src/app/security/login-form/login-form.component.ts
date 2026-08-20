import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../auth.service';

import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule
  ],
  providers: [
    JwtHelperService
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {

  jwtPayload: any;

  msg: any;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login(user: string, password: string) {
    this.auth.login(user, password)
    .then(() => {
      this.router.navigate(['/activities']);
    })
    .catch(() => {
      this.msg = 'Usuário e/ou senha inválida!';
    });
  }
}