import { Component } from '@angular/core';
import { AuthService } from '../../security/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  displayingMenu = false;

  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  
}