import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DatePicker } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { Activity } from '../../core/model';
import { ActivityService } from '../activity.service';
import { AuthService } from '../../security/auth.service';
import { MessageComponent } from '../../shared/message/message.component';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-activity-register',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    DatePicker,
    SelectModule,
    MessageComponent,
    RouterModule
   ],
   providers:[
    Title
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
    private auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ){
    this.activity = new Activity(this.auth.jwtPayload?.user_id);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params[`id`];
    if(id != 'new'){
      this.loadActivity(id);
    }
    this.title.setTitle('Cadastro de Atividade');// aqui!
  }

  get editing(): boolean {
    return Boolean(this.activity.id);
  }

  loadActivity(id: number) {
    this.activityService.findById(id)
      .then(activity => {
        if(activity){
          this.activity = activity;
        }
      })
      .catch(error => this.errorHandler.handle(error));
  }

  save(){
    if(this.editing){
      this.updateActivity();
    }else{
      this.addActivity();
    }
  }

  updateActivity() {
    this.activityService.update(this.activity)
      .then(activity => {
        this.messageService.add({ severity: 'success', detail: 'Atividade editada com sucesso!' });
        if (activity) {
          this.activity = activity;
        } else {
          this.errorHandler.handle(new Error('Atividade não encontrada.'));
          this.activity = new Activity(this.auth.jwtPayload?.user_id);
        }
      })
      .catch(error => this.errorHandler.handle(error));
  }

  addActivity() {
    this.activityService.add(this.activity)
      .then(addedActivity => {
        this.messageService.add({ severity: 'success', detail: 'Atividade adicionada com sucesso!' });
	      this.loadActivity(addedActivity.id);
        this.router.navigate(['/activities', addedActivity.id]);
      })
      .catch(error => this.errorHandler.handle(error));
  }

  new(activityForm: NgForm){
    this.activity = new Activity(this.auth.jwtPayload?.user_id);
    activityForm.reset();
    this.router.navigate(['/activities/new']);
  }

}