import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-activities-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    TooltipModule
  ],
  templateUrl: './activities-list.component.html',
  styleUrl: './activities-list.component.css'
})
export class ActivitiesListComponent {

  activities = [
    { type: 'CORRIDA', date: '29/07/2026', distance: 8.0, duration: 42, user: 'Fernando Duarte' },
    { type: 'CORRIDA', date: '30/07/2026', distance: 8.0, duration: 43, user: 'Fernando Duarte' },
    { type: 'CAMINHADA', date: '30/07/2026', distance: 5.0, duration: 55, user: 'Juliana Silva' }
  ];
  
}