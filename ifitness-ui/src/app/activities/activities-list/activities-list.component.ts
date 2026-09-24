import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

import { ActivityFilter, ActivityService } from '../activity.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { AuthService } from '../../security/auth.service';
import { User } from '../../core/model';

@Component({
  selector: 'app-activities-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    TooltipModule,
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

  type?: string;
  initialDate?: Date;
  finalDate?: Date;

  types = [
    { label: 'Todos', value: '' },
    { label: 'Caminhada', value: 'CAMINHADA' },
    { label: 'Ciclismo', value: 'CICLISMO' },
    { label: 'Corrida', value: 'CORRIDA' },
    { label: 'Natação', value: 'NATACAO' }
  ];

  activities = []

  constructor(
    private activityService: ActivityService,
    private confirmation: ConfirmationService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    private router: Router,
    private auth: AuthService
  ){ }

  ngOnInit(): void {
    this.title.setTitle('Lista de Atividades');
    this.filter();
  }

  filter(): void {
    const filter: ActivityFilter = {
      user: new User().id = this.auth.jwtPayload?.user_id,
      type: this.type,
      initialDate: this.initialDate,
      finalDate: this.finalDate
    }

    this.activityService.filter(filter)
      .then(result => {
        this.activities = result;
      })
      .catch(error => this.errorHandler.handle(error));

  }

  confirmRemoval(activity: any): void {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.delete(activity);
      }
    });
  }

  delete(activity: any): void {
    this.activityService.delete(activity.id)
      .then(() => {
        this.filter();
        this.messageService.add({ severity: 'success', detail: 'Atividade excluída com sucesso!' });
      })
      .catch(error => this.errorHandler.handle(error));
  }

}