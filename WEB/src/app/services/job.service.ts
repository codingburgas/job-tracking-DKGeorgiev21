import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

export interface JobPosting {
  id: number;
  title: string;
  companyName: string;
  description: string;
  datePosted: string;
  isActive: boolean;
  createdByName: string;
  applicationCount: number;
  hasApplied: boolean;
}

export interface CreateJobPosting {
  title: string;
  companyName: string;
  description: string;
}

export interface UpdateJobPosting extends CreateJobPosting {
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
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

  getAllJobs(): Observable<JobPosting[]> {
    const headers = this.authService.isLoggedIn() ? this.getHeaders() : new HttpHeaders();
    return this.http.get<JobPosting[]>(`${this.apiUrl}/jobs`, { headers });
  }

  getJobById(id: number): Observable<JobPosting> {
    const headers = this.authService.isLoggedIn() ? this.getHeaders() : new HttpHeaders();
    return this.http.get<JobPosting>(`${this.apiUrl}/jobs/${id}`, { headers });
  }

  createJob(job: CreateJobPosting): Observable<JobPosting> {
    return this.http.post<JobPosting>(`${this.apiUrl}/jobs`, job, { headers: this.getHeaders() });
  }

  updateJob(id: number, job: UpdateJobPosting): Observable<JobPosting> {
    return this.http.put<JobPosting>(`${this.apiUrl}/jobs/${id}`, job, { headers: this.getHeaders() });
  }

  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/jobs/${id}`, { headers: this.getHeaders() });
  }
}