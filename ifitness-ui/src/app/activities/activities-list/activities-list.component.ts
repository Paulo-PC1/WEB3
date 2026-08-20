import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ActivityService } from '../activity.service';

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

  activities = [];

  constructor(private activityService: ActivityService){ }

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.activityService.listByUser()
      .then(result => {
        this.activities = result;
      });
  }

}
