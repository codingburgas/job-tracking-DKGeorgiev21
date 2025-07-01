import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="container">
      <div class="register-wrapper">
        <mat-card class="register-card">
          <mat-card-header>
            <div class="header-content">
              <mat-icon class="register-icon">person_add</mat-icon>
              <h1>Create Account</h1>
              <p>Join our job search platform</p>
            </div>
          </mat-card-header>

          <mat-card-content>
            <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
              <div class="name-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>First Name</mat-label>
                  <input matInput 
                         [(ngModel)]="userData.firstName" 
                         name="firstName" 
                         required
                         autocomplete="given-name">
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Last Name</mat-label>
                  <input matInput 
                         [(ngModel)]="userData.lastName" 
                         name="lastName" 
                         required
                         autocomplete="family-name">
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Middle Name (Optional)</mat-label>
                <input matInput 
                       [(ngModel)]="userData.middleName" 
                       name="middleName"
                       autocomplete="additional-name">
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Username</mat-label>
                <input matInput 
                       [(ngModel)]="userData.username" 
                       name="username" 
                       required
                       autocomplete="username">
                <mat-icon matSuffix>person</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Password</mat-label>
                <input matInput 
                       type="password" 
                       [(ngModel)]="userData.password" 
                       name="password" 
                       required
                       minlength="6"
                       autocomplete="new-password">
                <mat-icon matSuffix>lock</mat-icon>
              </mat-form-field>

              <button mat-raised-button 
                      color="primary" 
                      type="submit" 
                      class="full-width register-btn"
                      [disabled]="!registerForm.form.valid || loading">
                <mat-icon *ngIf="!loading">person_add</mat-icon>
                <mat-icon *ngIf="loading" class="spinning">hourglass_empty</mat-icon>
                {{ loading ? 'Creating Account...' : 'Create Account' }}
              </button>
            </form>
          </mat-card-content>

          <mat-card-actions>
            <div class="actions-content">
              <p>Already have an account? <a routerLink="/login">Sign in here</a></p>
            </div>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .container {
      min-height: calc(100vh - 84px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }

    .register-wrapper {
      width: 100%;
      max-width: 500px;
    }

    .register-card {
      padding: 0;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      background: white;
    }

    .header-content {
      text-align: center;
      padding: 32px 32px 0;
    }

    .register-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #2563eb;
      margin-bottom: 16px;
    }

    .header-content h1 {
      font-size: 1.875rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .header-content p {
      color: #64748b;
      margin: 0;
    }

    mat-card-content {
      padding: 32px;
    }

    .name-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .half-width {
      flex: 1;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .register-btn {
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      margin-top: 8px;
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .actions-content {
      text-align: center;
      padding: 0 32px 32px;
    }

    .actions-content p {
      margin: 0;
      color: #64748b;
    }

    .actions-content a {
      color: #2563eb;
      text-decoration: none;
      font-weight: 600;
    }

    .actions-content a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .container {
        padding: 16px;
      }
      
      .name-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class RegisterComponent {
  userData = {
    firstName: '',
    middleName: '',
    lastName: '',
    username: '',
    password: ''
  };
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    this.loading = true;
    this.authService.register(this.userData).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackBar.open('Account created successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/jobs']);
      },
      error: (error) => {
        this.loading = false;
        const message = error.error?.message || 'Registration failed';
        this.snackBar.open(message, 'Close', { duration: 3000 });
      }
    });
  }
}