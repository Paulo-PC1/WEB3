import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { firstValueFrom } from 'rxjs';
import moment from 'moment';

import { AuthService } from '../security/auth.service';
import { Activity } from '../core/model';

export interface ActivityFilter {
  user?: any,
  type?: string,
  initialDate?: Date;
  finalDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  activitiesUrl = 'http://localhost:8080/activities';

  email: any;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private datePipe: DatePipe
  ) { }

  async listByUser(): Promise<any> {
    this.email = this.auth.jwtPayload?.sub;
    return await firstValueFrom(this.http.get(`${this.activitiesUrl}/user/${this.email}`));
  }

  async filter(filter: ActivityFilter): Promise<any> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    let params = new HttpParams();

    if (filter.user) {
      params = params.set('user', filter.user);
    }

    if (filter.type) {
      params = params.set('type', filter.type);
    }

    if (filter.initialDate) {
      params = params.set('initialDate', this.datePipe.transform(filter.initialDate, 'yyyy-MM-dd')!);
    }

    if (filter.finalDate) {
      params = params.set('finalDate', this.datePipe.transform(filter.finalDate, 'yyyy-MM-dd')!);
    }

    try {
      const response = await firstValueFrom(
        this.http.get(`${this.activitiesUrl}?resumo`, { headers, params })
      );
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async add(activity: Activity): Promise<Activity> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = Activity.toJson(activity);
    return await firstValueFrom(this.http.post<Activity>(this.activitiesUrl, body, { headers }));
  }

  async delete(id: number): Promise<any> {
    await this.http.delete(`${this.activitiesUrl}/${id}`)
      .toPromise();
    return null;
  }

  async update(activity: Activity): Promise<Activity | undefined> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const response = await this.http.put<Activity>(`${this.activitiesUrl}/${activity.id}`, Activity.toJson(activity), { headers })
      .toPromise();
    const updated = response;
    if (updated) {
      this.stringToDate(updated);
    }
    return updated;
  }

  async findById(id: number): Promise<Activity | undefined> {
    const response = await this.http.get<Activity>(`${this.activitiesUrl}/${id}`)
      .toPromise();
    const activity = response;
    if (activity) {
      this.stringToDate(activity);
    }
    return activity;
  }

  private stringToDate(activity: Activity): void {
    activity.date = moment(activity.date, 'DD/MM/YYYY').toDate();
  }

}