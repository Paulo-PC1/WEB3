import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ButtonModule,
    TableModule,
    TooltipModule
  ],
        
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ifitness-ui';

  activities = [
    { type: 'CORRIDA', date: '29/07/2026', distance: 8.0, duration: 42, user: 'Fernando Duarte' },
    { type: 'CORRIDA', date: '30/07/2026', distance: 8.0, duration: 43, user: 'Fernando Duarte' },
    { type: 'CAMINHADA', date: '30/07/2026', distance: 5.0, duration: 55, user: 'Juliana Silva' }
  ];

}