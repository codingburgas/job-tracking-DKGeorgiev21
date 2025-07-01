import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { JobService, JobPosting } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>Available Jobs</h1>
        <p class="subtitle">Find your next opportunity</p>
      </div>

      <div class="jobs-grid" *ngIf="jobs.length > 0">
        <mat-card class="job-card" *ngFor="let job of jobs">
          <mat-card-header>
            <div class="job-header">
              <h2>{{ job.title }}</h2>
              <mat-chip-set>
                <mat-chip class="status-chip">
                  {{ job.applicationCount }} {{ job.applicationCount === 1 ? 'application' : 'applications' }}
                </mat-chip>
                <mat-chip *ngIf="job.hasApplied && isLoggedIn" class="applied-chip">
                  Applied
                </mat-chip>
              </mat-chip-set>
            </div>
          </mat-card-header>
          
          <mat-card-content>
            <div class="company-info">
              <mat-icon>business</mat-icon>
              <span>{{ job.companyName }}</span>
            </div>
            
            <p class="description">{{ job.description | slice:0:150 }}{{ job.description.length > 150 ? '...' : '' }}</p>
            
            <div class="job-meta">
              <div class="date">
                <mat-icon>schedule</mat-icon>
                <span>Posted {{ job.datePosted | date:'mediumDate' }}</span>
              </div>
            </div>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-raised-button color="primary" [routerLink]="['/jobs', job.id]">
              <mat-icon>visibility</mat-icon>
              View Details
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="empty-state" *ngIf="jobs.length === 0 && !loading">
        <mat-icon class="empty-icon">work_off</mat-icon>
        <h2>No jobs available</h2>
        <p>Check back later for new opportunities!</p>
      </div>

      <div class="loading" *ngIf="loading">
        <mat-icon class="loading-icon">hourglass_empty</mat-icon>
        <p>Loading jobs...</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
    }

    .header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 8px;
    }

    .subtitle {
      font-size: 1.1rem;
      color: #64748b;
    }

    .jobs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .job-card {
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .job-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
    }

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .job-header h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
      flex: 1;
    }

    .status-chip {
      background-color: #e0f2fe;
      color: #0277bd;
    }

    .applied-chip {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .company-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 16px 0;
      color: #64748b;
      font-weight: 500;
    }

    .description {
      color: #475569;
      line-height: 1.6;
      margin: 16px 0;
    }

    .job-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }

    .date {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #64748b;
      font-size: 0.875rem;
    }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
      color: #64748b;
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .loading {
      text-align: center;
      padding: 80px 20px;
      color: #64748b;
    }

    .loading-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .jobs-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .header h1 {
        font-size: 2rem;
      }
      
      .job-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  `]
})
export class JobListComponent implements OnInit {
  jobs: JobPosting[] = [];
  loading = true;
  isLoggedIn = false;

  constructor(
    private jobService: JobService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.loadJobs();
  }

  loadJobs() {
    this.loading = true;
    this.jobService.getAllJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.loading = false;
      }
    });
  }
}