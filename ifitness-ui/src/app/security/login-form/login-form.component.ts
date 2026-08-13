import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../auth.service';

import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

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

  constructor(private auth: AuthService) {
    this.jwtPayload = this.auth.jwtPayload;
  }

  login(user: string, password: string): void {
    this.auth.login(user, password);
  }

}