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
  selector: 'app-login',
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
      <div class="login-wrapper">
        <mat-card class="login-card">
          <mat-card-header>
            <div class="header-content">
              <mat-icon class="login-icon">login</mat-icon>
              <h1>Welcome Back</h1>
              <p>Sign in to your account</p>
            </div>
          </mat-card-header>

          <mat-card-content>
            <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Username</mat-label>
                <input matInput 
                       [(ngModel)]="credentials.username" 
                       name="username" 
                       required
                       autocomplete="username">
                <mat-icon matSuffix>person</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Password</mat-label>
                <input matInput 
                       type="password" 
                       [(ngModel)]="credentials.password" 
                       name="password" 
                       required
                       autocomplete="current-password">
                <mat-icon matSuffix>lock</mat-icon>
              </mat-form-field>

              <button mat-raised-button 
                      color="primary" 
                      type="submit" 
                      class="full-width login-btn"
                      [disabled]="!loginForm.form.valid || loading">
                <mat-icon *ngIf="!loading">login</mat-icon>
                <mat-icon *ngIf="loading" class="spinning">hourglass_empty</mat-icon>
                {{ loading ? 'Signing In...' : 'Sign In' }}
              </button>
            </form>

            <div class="demo-accounts">
              <h3>Demo Accounts</h3>
              <div class="demo-buttons">
                <button mat-outlined-button (click)="loginAsAdmin()" [disabled]="loading" class="demo-btn admin-btn">
                  <mat-icon>admin_panel_settings</mat-icon>
                  Login as Admin
                </button>
                <button mat-outlined-button (click)="createDemoUser()" [disabled]="loading" class="demo-btn user-btn">
                  <mat-icon>person</mat-icon>
                  Create Demo User
                </button>
              </div>
              <p class="demo-note">Use these accounts for testing</p>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <div class="actions-content">
              <p>Don't have an account? <a routerLink="/register">Sign up here</a></p>
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

    .login-wrapper {
      width: 100%;
      max-width: 450px;
    }

    .login-card {
      padding: 0;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      background: white;
    }

    .header-content {
      text-align: center;
      padding: 32px 32px 0;
    }

    .login-icon {
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

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .login-btn {
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      margin-top: 8px;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
      color: white !important;
    }

    .login-btn:hover {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important;
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .demo-accounts {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
    }

    .demo-accounts h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 16px 0;
    }

    .demo-buttons {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }

    .demo-btn {
      flex: 1;
      height: 40px;
      font-weight: 500;
    }

    .admin-btn {
      border-color: #dc2626 !important;
      color: #dc2626 !important;
    }

    .admin-btn:hover {
      background-color: #fef2f2 !important;
    }

    .user-btn {
      border-color: #2563eb !important;
      color: #2563eb !important;
    }

    .user-btn:hover {
      background-color: #eff6ff !important;
    }

    .demo-note {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
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
      
      .demo-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class LoginComponent {
  credentials = {
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
    if (this.credentials.username && this.credentials.password) {
      this.loading = true;
      this.authService.login(this.credentials.username, this.credentials.password).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          
          // Redirect based on role
          if (response.user.role === 'ADMIN') {
            this.router.navigate(['/admin/jobs']);
          } else {
            this.router.navigate(['/jobs']);
          }
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Invalid username or password', 'Close', { duration: 3000 });
        }
      });
    }
  }

  loginAsAdmin() {
    this.credentials.username = 'admin';
    this.credentials.password = 'admin123';
    this.onSubmit();
  }

  createDemoUser() {
    // Create a demo user account first, then login
    const demoUserData = {
      firstName: 'Demo',
      middleName: '',
      lastName: 'User',
      username: 'demo',
      password: 'demo123'
    };

    this.loading = true;
    this.authService.register(demoUserData).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackBar.open('Demo user created and logged in!', 'Close', { duration: 3000 });
        this.router.navigate(['/jobs']);
      },
      error: (error) => {
        // If user already exists, try to login
        if (error.error?.message?.includes('already exists')) {
          this.credentials.username = 'demo';
          this.credentials.password = 'demo123';
          this.onSubmit();
        } else {
          this.loading = false;
          this.snackBar.open('Failed to create demo user', 'Close', { duration: 3000 });
        }
      }
    });
  }
}