import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ActivityFilter, ActivityService } from '../activities/activity.service';
import { AuthService } from '../security/auth.service';
import { ErrorHandlerService } from '../core/error-handler.service';
import { ActivityStatistics } from '../core/model';
import { ChartModule } from 'primeng/chart';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule
  ],
  providers: [
    Title
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  statistics: ActivityStatistics = {
    totalDistance: 0,
    totalDuration: 0,
    totalActivities: 0,
    byType: [],
  };

  typeLabels: any = {
    CAMINHADA: 'Caminhada',
    CICLISMO: 'Ciclismo',
    CORRIDA: 'Corrida',
    NATACAO: 'Natação'
  };

  chartData: any;
  recentActivities: any[] = [];

  chartOptions = {
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  constructor(
    private activityService: ActivityService,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Painel Inicial');
    this.loadStatistics();
    this.loadRecentActivities();
  }

  // Reaproveita a consulta paginada: primeira página, 5 registros, mais recentes primeiro
  loadRecentActivities(): void {
    const filter = new ActivityFilter();
    filter.user = this.auth.jwtPayload?.user_id;
    filter.itemsPerPage = 5;
    filter.sortField = 'date';
    filter.sortOrder = -1;

    this.activityService.filter(filter)
      .then(result => {
        this.recentActivities = result.activities;
      })
      .catch(error => this.errorHandler.handle(error));
  }

  loadStatistics(): void {
    this.activityService.statistics()
      .then(statistics => {
        this.statistics = statistics;
        this.buildChart();
      })
      .catch(error => this.errorHandler.handle(error));
  }

  buildChart(): void {
    this.chartData = {
      labels: this.statistics.byType.map(item => this.typeLabels[item.type]),
      datasets: [
        {
          data: this.statistics.byType.map(item => item.total),
          backgroundColor: ['#198754', '#0d6efd', '#ffc107', '#dc3545']
        }
      ]
    };
  }

  
}