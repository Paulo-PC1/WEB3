import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

import { ActivityFilter, ActivityService } from '../activity.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { AuthService } from '../../security/auth.service';

@Component({
  selector: 'app-activities-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    RouterModule,
    SelectModule,
    DatePickerModule
  ],
  providers:[
    Title
  ],
  templateUrl: './activities-list.component.html',
  styleUrl: './activities-list.component.css'
})
export class ActivitiesListComponent {

  filter = new ActivityFilter();

  types = [
    { label: 'Todos', value: '' },
    { label: 'Caminhada', value: 'CAMINHADA' },
    { label: 'Ciclismo', value: 'CICLISMO' },
    { label: 'Corrida', value: 'CORRIDA' },
    { label: 'Natação', value: 'NATACAO' }
  ];

  activities = [];

  totalRecords = 0;

  first = 0; // posição do primeiro registro da página exibida

  constructor(
    private activityService: ActivityService,
    private confirmation: ConfirmationService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    private router: Router,
    public auth: AuthService
  ){ }

  ngOnInit(): void {
    this.title.setTitle('Lista de Atividades');
  }

  search(page: number = 0): void {
    this.filter.user = this.auth.jwtPayload?.user_id;
    this.filter.page = page;
    this.first = page * this.filter.itemsPerPage;

    this.activityService.filter(this.filter)
      .then(result => {
        this.activities = result.activities;
        this.totalRecords = result.total;
      })
      .catch(error => this.errorHandler.handle(error));
  }

  // Chamado pela tabela ao abrir a página e ao trocar de página
  whenChangePage(event: TableLazyLoadEvent): void {
    this.filter.sortField = event.sortField as string;
    this.filter.sortOrder = event.sortOrder as number;
    const page = event.first! / event.rows!;
    this.search(page);
  }

  confirmRemoval(activity: any): void {
    this.confirmation.confirm({
      header: 'Exclusão',
      message: 'Tem certeza que deseja excluir a atividade?',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary' },
      accept: () => {
        this.delete(activity);
      }
    });
  }

  delete(activity: any): void {
    this.activityService.delete(activity.id)
      .then(() => {
        this.search();
        this.messageService.add({ severity: 'success', detail: 'Atividade excluída com sucesso!' });
      })
      .catch(error => this.errorHandler.handle(error));
  }

}