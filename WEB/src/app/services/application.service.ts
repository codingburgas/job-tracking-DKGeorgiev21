import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

export interface Application {
  id: number;
  status: string;
  submittedAt: string;
  updatedAt?: string;
  jobTitle: string;
  companyName: string;
  applicantName: string;
  jobPostingId: number;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getMyApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications/my-applications`, { headers: this.getHeaders() });
  }

  getJobApplications(jobId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications/job/${jobId}`, { headers: this.getHeaders() });
  }

  getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications`, { headers: this.getHeaders() });
  }

  submitApplication(jobId: number): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/applications/apply/${jobId}`, {}, { headers: this.getHeaders() });
  }

  updateApplicationStatus(applicationId: number, status: string): Observable<Application> {
    return this.http.put<Application>(`${this.apiUrl}/applications/${applicationId}/status`, { status }, { headers: this.getHeaders() });
  }
}