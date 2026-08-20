import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './security/auth.service';
import { NavbarComponent } from './core/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent 
  ],
  providers: [
    AuthService
  ],
  
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ifitness-ui';

}