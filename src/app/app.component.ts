import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar class="header">
      <div class="container">
        <div class="nav-content">
          <a routerLink="/jobs" class="logo">
            <mat-icon>work</mat-icon>
            <span>JobSearch</span>
          </a>

          <div class="nav-section">
            <!-- Navigation for non-logged in users -->
            <nav class="nav-links" *ngIf="!isLoggedIn">
              <a routerLink="/jobs" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
                Jobs
              </a>
            </nav>

            <!-- Auth buttons for non-logged in users -->
            <div class="auth-buttons" *ngIf="!isLoggedIn">
              <button mat-button routerLink="/login" class="auth-btn login-btn">
                <mat-icon>login</mat-icon>
                Login
              </button>
              <button mat-raised-button routerLink="/register" class="auth-btn register-btn">
                <mat-icon>person_add</mat-icon>
                Register
              </button>
            </div>

            <!-- Navigation for logged in users -->
            <nav class="nav-links" *ngIf="isLoggedIn && currentUser?.role === 'USER'">
              <a routerLink="/jobs" routerLinkActive="active" class="nav-link">Jobs</a>
              <a routerLink="/my-applications" routerLinkActive="active" class="nav-link">My Applications</a>
            </nav>

            <nav class="nav-links" *ngIf="isLoggedIn && currentUser?.role === 'ADMIN'">
              <a routerLink="/admin/jobs" routerLinkActive="active" class="nav-link">Manage Jobs</a>
              <a routerLink="/admin/applications" routerLinkActive="active" class="nav-link">Applications</a>
            </nav>

            <!-- User menu for logged in users -->
            <div class="user-section" *ngIf="isLoggedIn">
              <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu">
                <mat-icon>{{ currentUser?.role === 'ADMIN' ? 'admin_panel_settings' : 'account_circle' }}</mat-icon>
                <span class="user-name">{{currentUser?.firstName}} {{currentUser?.lastName}}</span>
                <mat-icon>arrow_drop_down</mat-icon>
              </button>
            </div>

            <mat-menu #userMenu="matMenu">
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </div>
    </mat-toolbar>

    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .header {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      background: #ffffff;
      color: #1e293b;
      border-bottom: 1px solid #e2e8f0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      width: 100%;
    }

    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 64px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: #2563eb;
      font-size: 24px;
      font-weight: 700;
      transition: all 0.3s ease;
    }

    .logo:hover {
      transform: scale(1.05);
      color: #1d4ed8;
    }

    .logo mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .nav-section {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-link {
      color: #64748b;
      text-decoration: none;
      font-weight: 500;
      font-size: 16px;
      padding: 10px 20px;
      border-radius: 8px;
      transition: all 0.3s ease;
      position: relative;
    }

    .nav-link:hover {
      background-color: #f1f5f9;
      color: #2563eb;
      transform: translateY(-1px);
    }

    .nav-link.active {
      background-color: #eff6ff;
      color: #2563eb;
      font-weight: 600;
    }

    .auth-buttons {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .auth-btn {
      font-weight: 600;
      font-size: 14px;
      height: 40px;
      border-radius: 8px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 16px;
    }

    .login-btn {
      color: #2563eb !important;
      border: 2px solid #e2e8f0;
      background: transparent;
    }

    .login-btn:hover {
      background-color: #f8fafc;
      border-color: #2563eb;
      transform: translateY(-1px);
    }

    .register-btn {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
      color: white !important;
      border: none;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
    }

    .register-btn:hover {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
    }

    .user-section {
      display: flex;
      align-items: center;
    }

    .user-menu {
      color: #64748b !important;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 0.3s ease;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }

    .user-menu:hover {
      background: #f1f5f9;
      color: #2563eb !important;
      transform: translateY(-1px);
    }

    .user-name {
      font-weight: 500;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .main-content {
      min-height: calc(100vh - 64px);
      padding-top: 20px;
      background: #f8fafc;
    }

    @media (max-width: 768px) {
      .container {
        padding: 0 16px;
      }

      .nav-section {
        gap: 16px;
      }
      
      .nav-links {
        gap: 4px;
      }
      
      .nav-link {
        padding: 8px 12px;
        font-size: 14px;
      }
      
      .logo span {
        display: none;
      }

      .logo mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .auth-buttons {
        gap: 8px;
      }

      .auth-btn {
        font-size: 12px;
        height: 36px;
        padding: 0 12px;
      }

      .auth-btn mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .user-name {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .nav-links {
        display: none;
      }

      .nav-section {
        gap: 12px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/jobs']);
  }
}