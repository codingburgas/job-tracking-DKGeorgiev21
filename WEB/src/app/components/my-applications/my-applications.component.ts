import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { ApplicationService, Application } from '../../services/application.service';

@Component({
  selector: 'app-my-applications',
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
        <h1>My Applications</h1>
        <p class="subtitle">Track your job applications</p>
      </div>

      <div class="applications-list" *ngIf="applications.length > 0">
        <mat-card class="application-card" *ngFor="let application of applications">
          <mat-card-header>
            <div class="application-header">
              <div class="job-info">
                <h2>{{ application.jobTitle }}</h2>
                <div class="company-info">
                  <mat-icon>business</mat-icon>
                  <span>{{ application.companyName }}</span>
                </div>
              </div>
              <mat-chip [class]="getStatusClass(application.status)">
                {{ application.status }}
              </mat-chip>
            </div>
          </mat-card-header>

          <mat-card-content>
            <div class="application-meta">
              <div class="meta-item">
                <mat-icon>schedule</mat-icon>
                <span>Applied {{ application.submittedAt | date:'mediumDate' }}</span>
              </div>
              <div class="meta-item" *ngIf="application.updatedAt">
                <mat-icon>update</mat-icon>
                <span>Updated {{ application.updatedAt | date:'mediumDate' }}</span>
              </div>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button [routerLink]="['/jobs', application.jobPostingId]">
              <mat-icon>visibility</mat-icon>
              View Job
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="empty-state" *ngIf="applications.length === 0 && !loading">
        <mat-icon class="empty-icon">assignment</mat-icon>
        <h2>No applications yet</h2>
        <p>Start applying to jobs to see your applications here!</p>
        <button mat-raised-button color="primary" routerLink="/jobs">
          <mat-icon>search</mat-icon>
          Browse Jobs
        </button>
      </div>

      <div class="loading" *ngIf="loading">
        <mat-icon class="loading-icon">hourglass_empty</mat-icon>
        <p>Loading your applications...</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1000px;
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

    .applications-list {
      display: grid;
      gap: 20px;
      margin-bottom: 40px;
    }

    .application-card {
      transition: all 0.3s ease;
    }

    .application-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
    }

    .application-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      width: 100%;
    }

    .job-info h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .company-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #64748b;
      font-weight: 500;
    }

    .application-meta {
      display: flex;
      gap: 24px;
      margin: 16px 0;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #64748b;
      font-size: 0.875rem;
    }

    .status-submitted {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .status-selected {
      background-color: #d1fae5;
      color: #065f46;
    }

    .status-rejected {
      background-color: #fee2e2;
      color: #991b1b;
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

    .empty-state h2 {
      color: #374151;
      margin-bottom: 8px;
    }

    .empty-state p {
      margin-bottom: 24px;
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
      .header h1 {
        font-size: 2rem;
      }

      .application-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .application-meta {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class MyApplicationsComponent implements OnInit {
  applications: Application[] = [];
  loading = true;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.loading = true;
    this.applicationService.getMyApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'status-submitted';
      case 'selected for interview':
        return 'status-selected';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-submitted';
    }
  }
}