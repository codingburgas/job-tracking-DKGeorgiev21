import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

import { JobService, JobPosting, CreateJobPosting, UpdateJobPosting } from '../../../services/job.service';

@Component({
  selector: 'app-admin-jobs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatChipsModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>Manage Jobs</h1>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Create New Job
        </button>
      </div>

      <div class="jobs-grid" *ngIf="jobs.length > 0">
        <mat-card class="job-card" *ngFor="let job of jobs">
          <mat-card-header>
            <div class="job-header">
              <div class="job-info">
                <h2>{{ job.title }}</h2>
                <div class="company-info">
                  <mat-icon>business</mat-icon>
                  <span>{{ job.companyName }}</span>
                </div>
              </div>
              <div class="job-status">
                <mat-chip [class]="job.isActive ? 'status-active' : 'status-inactive'">
                  {{ job.isActive ? 'Active' : 'Inactive' }}
                </mat-chip>
              </div>
            </div>
          </mat-card-header>

          <mat-card-content>
            <p class="description">{{ job.description | slice:0:150 }}{{ job.description.length > 150 ? '...' : '' }}</p>
            
            <div class="job-meta">
              <div class="meta-item">
                <mat-icon>schedule</mat-icon>
                <span>Posted {{ job.datePosted | date:'mediumDate' }}</span>
              </div>
              <div class="meta-item">
                <mat-icon>people</mat-icon>
                <span>{{ job.applicationCount }} applications</span>
              </div>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button (click)="openEditDialog(job)">
              <mat-icon>edit</mat-icon>
              Edit
            </button>
            <button mat-button [routerLink]="['/jobs', job.id]">
              <mat-icon>visibility</mat-icon>
              View
            </button>
            <button mat-button color="warn" (click)="deleteJob(job)">
              <mat-icon>delete</mat-icon>
              Delete
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="empty-state" *ngIf="jobs.length === 0 && !loading">
        <mat-icon class="empty-icon">work_off</mat-icon>
        <h2>No jobs created yet</h2>
        <p>Create your first job posting to get started!</p>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Create Job
        </button>
      </div>

      <div class="loading" *ngIf="loading">
        <mat-icon class="loading-icon">hourglass_empty</mat-icon>
        <p>Loading jobs...</p>
      </div>
    </div>

    <!-- Create/Edit Job Dialog -->
    <div class="dialog-overlay" *ngIf="showDialog" (click)="closeDialog()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h2>{{ editingJob ? 'Edit Job' : 'Create New Job' }}</h2>
          <button mat-icon-button (click)="closeDialog()">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <form (ngSubmit)="saveJob()" #jobForm="ngForm" class="dialog-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Job Title</mat-label>
            <input matInput [(ngModel)]="jobData.title" name="title" required maxlength="100">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Company Name</mat-label>
            <input matInput [(ngModel)]="jobData.companyName" name="companyName" required maxlength="100">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Job Description</mat-label>
            <textarea matInput 
                      [(ngModel)]="jobData.description" 
                      name="description" 
                      required 
                      maxlength="1000"
                      rows="6"></textarea>
          </mat-form-field>

          <div class="checkbox-field" *ngIf="editingJob">
            <label>
              <input type="checkbox" [(ngModel)]="jobData.isActive" name="isActive">
              Active Job Posting
            </label>
          </div>

          <div class="dialog-actions">
            <button type="button" mat-button (click)="closeDialog()">Cancel</button>
            <button type="submit" 
                    mat-raised-button 
                    color="primary" 
                    [disabled]="!jobForm.form.valid || saving">
              {{ saving ? 'Saving...' : (editingJob ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
    }

    .header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1e293b;
    }

    .jobs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .job-card {
      transition: all 0.3s ease;
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

    .status-active {
      background-color: #d1fae5;
      color: #065f46;
    }

    .status-inactive {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .description {
      color: #475569;
      line-height: 1.6;
      margin: 16px 0;
    }

    .job-meta {
      display: flex;
      gap: 24px;
      margin-top: 16px;
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

    /* Dialog Styles */
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 0;
      border-bottom: 1px solid #e2e8f0;
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
    }

    .dialog-form {
      padding: 24px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .checkbox-field {
      margin: 16px 0;
    }

    .checkbox-field label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .header h1 {
        font-size: 2rem;
      }

      .jobs-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .job-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .job-meta {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class AdminJobsComponent implements OnInit {
  jobs: JobPosting[] = [];
  loading = true;
  showDialog = false;
  editingJob: JobPosting | null = null;
  saving = false;

  jobData: CreateJobPosting & { isActive?: boolean } = {
    title: '',
    companyName: '',
    description: '',
    isActive: true
  };

  constructor(
    private jobService: JobService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
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

  openCreateDialog() {
    this.editingJob = null;
    this.jobData = {
      title: '',
      companyName: '',
      description: '',
      isActive: true
    };
    this.showDialog = true;
  }

  openEditDialog(job: JobPosting) {
    this.editingJob = job;
    this.jobData = {
      title: job.title,
      companyName: job.companyName,
      description: job.description,
      isActive: job.isActive
    };
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.editingJob = null;
  }

  saveJob() {
    this.saving = true;

    if (this.editingJob) {
      // Update existing job
      const updateData: UpdateJobPosting = {
        title: this.jobData.title,
        companyName: this.jobData.companyName,
        description: this.jobData.description,
        isActive: this.jobData.isActive || false
      };

      this.jobService.updateJob(this.editingJob.id, updateData).subscribe({
        next: (updatedJob) => {
          this.saving = false;
          this.closeDialog();
          this.loadJobs();
          this.snackBar.open('Job updated successfully!', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.saving = false;
          this.snackBar.open('Failed to update job', 'Close', { duration: 3000 });
        }
      });
    } else {
      // Create new job
      const createData: CreateJobPosting = {
        title: this.jobData.title,
        companyName: this.jobData.companyName,
        description: this.jobData.description
      };

      this.jobService.createJob(createData).subscribe({
        next: (newJob) => {
          this.saving = false;
          this.closeDialog();
          this.loadJobs();
          this.snackBar.open('Job created successfully!', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.saving = false;
          this.snackBar.open('Failed to create job', 'Close', { duration: 3000 });
        }
      });
    }
  }

  deleteJob(job: JobPosting) {
    if (confirm(`Are you sure you want to delete "${job.title}"?`)) {
      this.jobService.deleteJob(job.id).subscribe({
        next: () => {
          this.loadJobs();
          this.snackBar.open('Job deleted successfully!', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Failed to delete job', 'Close', { duration: 3000 });
        }
      });
    }
  }
}