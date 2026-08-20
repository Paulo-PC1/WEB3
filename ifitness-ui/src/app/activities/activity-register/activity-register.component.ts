import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

import { Activity } from '../../core/model';
import { ActivityService } from '../activity.service';
import { AuthService } from '../../security/auth.service';

@Component({
  selector: 'app-activity-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    DatePickerModule,
    SelectModule
  ],
  templateUrl: './activity-register.component.html',
  styleUrl: './activity-register.component.css'
})
export class ActivityRegisterComponent {

  types = [
    { label: 'Caminhada', value: 'CAMINHADA' },
    { label: 'Ciclismo', value: 'CICLISMO' },
    { label: 'Corrida', value: 'CORRIDA' },
    { label: 'Natação', value: 'NATACAO' }
  ];

  activity: Activity;

  constructor(
    private activityService: ActivityService,
    private auth: AuthService
  ){
    this.activity = new Activity(this.auth.jwtPayload?.user_id);
  }

  save(activityForm: NgForm) {
    this.activityService.add(this.activity)
      .then(() => {
        console.log('Atividade adicionada com sucesso!');
        activityForm.reset();
        this.activity = new Activity(this.auth.jwtPayload?.user_id);
      })
      .catch(erro => console.log(erro));
  }

}
