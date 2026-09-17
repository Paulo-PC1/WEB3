import { Component, LOCALE_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { ToastModule} from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { AuthService } from './security/auth.service';
import { NavbarComponent } from './core/navbar/navbar.component';
import { ErrorHandlerService } from './core/error-handler.service';

registerLocaleData(localePt);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [
    AuthService,
    MessageService,
    ConfirmationService,
    ErrorHandlerService,
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ifitness-ui';

  constructor(private router: Router){}

  showingNavbar(): boolean {
    return this.router.url != '/login' && this.router.url != '/users/new';
  }

}