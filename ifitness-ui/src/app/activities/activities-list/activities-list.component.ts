import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ActivityService } from '../activity.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-activities-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    RouterModule
  ],

  templateUrl: './activities-list.component.html',
  styleUrl: './activities-list.component.css'
})
export class ActivitiesListComponent {

  activities = [];

  constructor(
    private activityService: ActivityService,
    private confirmation: ConfirmationService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService
  )
  { }

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.activityService.listByUser()
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
        this.list();
        this.messageService.add({ severity: 'success', detail: 'Atividade excluída com sucesso!' });
      })
      .catch(error => this.errorHandler.handle(error));
  }
}
