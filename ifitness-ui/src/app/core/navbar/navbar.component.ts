import { Component } from '@angular/core';
import { AuthService } from '../../security/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
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
    this.auth.logout()
      .catch(error => console.error('Erro ao encerrar a sessão na API', error))
      .then(() => this.router.navigate(['/login']));
  }
  
}