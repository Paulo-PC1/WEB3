import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../security/auth.service';
import { Activity } from '../core/model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  activitiesUrl = 'http://localhost:8080/activities';

  email: any;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  async listByUser(): Promise<any> {
    this.email = this.auth.jwtPayload?.user_name;
    return await firstValueFrom(this.http.get(`${this.activitiesUrl}/user/${this.email}`));
  }

  async add(activity: Activity): Promise<Activity> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = Activity.toJson(activity);
    return await firstValueFrom(this.http.post<Activity>(this.activitiesUrl, body, { headers }));
  }

}