import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';

import { JobService, JobPosting } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-job-detail',
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
      <div class="back-button">
        <button mat-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Back to Jobs
        </button>
      </div>

      <div class="job-detail" *ngIf="job && !loading">
        <mat-card class="job-card">
          <mat-card-header>
            <div class="job-header">
              <div class="job-title-section">
                <h1>{{ job.title }}</h1>
                <div class="company-info">
                  <mat-icon>business</mat-icon>
                  <span>{{ job.companyName }}</span>
                </div>
              </div>
              <div class="job-actions">
                <mat-chip-set>
                  <mat-chip class="status-chip">
                    {{ job.applicationCount }} {{ job.applicationCount === 1 ? 'application' : 'applications' }}
                  </mat-chip>
                  <mat-chip *ngIf="job.hasApplied && isLoggedIn" class="applied-chip">
                    Applied
                  </mat-chip>
                </mat-chip-set>
              </div>
            </div>
          </mat-card-header>

          <mat-card-content>
            <div class="job-meta">
              <div class="meta-item">
                <mat-icon>schedule</mat-icon>
                <span>Posted {{ job.datePosted | date:'fullDate' }}</span>
              </div>
              <div class="meta-item">
                <mat-icon>person</mat-icon>
                <span>Posted by {{ job.createdByName }}</span>
              </div>
            </div>

            <div class="job-description">
              <h2>Job Description</h2>
              <p>{{ job.description }}</p>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-raised-button 
                    color="primary" 
                    *ngIf="isLoggedIn && !job.hasApplied && currentUser?.role === 'USER'"
                    (click)="applyToJob()"
                    [disabled]="applying">
              <mat-icon *ngIf="!applying">send</mat-icon>
              <mat-icon *ngIf="applying" class="spinning">hourglass_empty</mat-icon>
              {{ applying ? 'Applying...' : 'Apply Now' }}
            </button>

            <button mat-stroked-button 
                    *ngIf="job.hasApplied && currentUser?.role === 'USER'"
                    disabled>
              <mat-icon>check_circle</mat-icon>
              Already Applied
            </button>

            <button mat-button 
                    *ngIf="!isLoggedIn"
                    routerLink="/login">
              <mat-icon>login</mat-icon>
              Login to Apply
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="loading" *ngIf="loading">
        <mat-icon class="loading-icon">hourglass_empty</mat-icon>
        <p>Loading job details...</p>
      </div>

      <div class="error" *ngIf="error">
        <mat-icon>error</mat-icon>
        <p>{{ error }}</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .back-button {
      margin-bottom: 20px;
    }

    .job-card {
      margin-bottom: 20px;
    }

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      width: 100%;
    }

    .job-title-section h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 12px 0;
    }

    .company-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #64748b;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .status-chip {
      background-color: #e0f2fe;
      color: #0277bd;
    }

    .applied-chip {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .job-meta {
      display: flex;
      gap: 24px;
      margin: 24px 0;
      padding: 16px 0;
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #64748b;
    }

    .job-description {
      margin: 24px 0;
    }

    .job-description h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 16px;
    }

    .job-description p {
      color: #475569;
      line-height: 1.7;
      white-space: pre-wrap;
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

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .error {
      text-align: center;
      padding: 40px 20px;
      color: #dc2626;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    @media (max-width: 768px) {
      .job-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .job-title-section h1 {
        font-size: 1.5rem;
      }

      .job-meta {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class JobDetailComponent implements OnInit {
  job: JobPosting | null = null;
  loading = true;
  applying = false;
  error = '';
  isLoggedIn = false;
  currentUser: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private applicationService: ApplicationService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();
    
    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      this.loadJob(parseInt(jobId));
    }
  }

  loadJob(id: number) {
    this.loading = true;
    this.jobService.getJobById(id).subscribe({
      next: (job) => {
        this.job = job;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading job:', error);
        this.error = 'Job not found';
        this.loading = false;
      }
    });
  }

  applyToJob() {
    if (!this.job) return;

    this.applying = true;
    this.applicationService.submitApplication(this.job.id).subscribe({
      next: (application) => {
        this.applying = false;
        this.job!.hasApplied = true;
        this.job!.applicationCount++;
        this.snackBar.open('Application submitted successfully!', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.applying = false;
        const message = error.error?.message || 'Failed to submit application';
        this.snackBar.open(message, 'Close', { duration: 3000 });
      }
    });
  }

  goBack() {
    this.router.navigate(['/jobs']);
  }
}