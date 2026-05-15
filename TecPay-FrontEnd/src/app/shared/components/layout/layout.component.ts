import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <nav class="navbar">
      <div class="nav-left">
        <div class="brand-block">
          <div class="brand-icon"><mat-icon>inventory_2</mat-icon></div>
          <div>
            <span class="brand">TecPay</span>
            <span class="brand-sub">Catalogo de Productos</span>
          </div>
        </div>
      </div>
      <div class="nav-right">
        <a routerLink="/products" routerLinkActive="nav-active" class="nav-link">
          <mat-icon>dashboard</mat-icon>
          <span>Productos</span>
        </a>
        <button class="logout-btn" (click)="logout()">
          <mat-icon>power_settings_new</mat-icon>
          <span>Salir</span>
        </button>
      </div>
    </nav>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0 32px; height: 64px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      position: sticky; top: 0; z-index: 1000;
    }
    .nav-left { display: flex; align-items: center; }
    .brand-block { display: flex; align-items: center; gap: 12px; }
    .brand-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: linear-gradient(135deg, #e94560, #c23152);
      display: flex; align-items: center; justify-content: center;
      color: #fff; box-shadow: 0 3px 10px rgba(233,69,96,0.4);
    }
    .brand-icon mat-icon { font-size: 22px; width: 22px; height: 22px; }
    .brand { display: block; font-size: 1.25rem; font-weight: 800; color: #fff; letter-spacing: 1px; }
    .brand-sub { display: block; font-size: 0.7rem; color: rgba(255,255,255,0.5); letter-spacing: 0.5px; text-transform: uppercase; }
    .nav-right { display: flex; align-items: center; gap: 8px; }
    .nav-link {
      display: flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 8px;
      color: rgba(255,255,255,0.7); text-decoration: none;
      font-size: 0.85rem; font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer; border: none; background: none;
    }
    .nav-link:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .nav-active { background: rgba(233,69,96,0.2) !important; color: #e94560 !important; }
    .logout-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 8px;
      color: rgba(255,255,255,0.5); font-size: 0.85rem; font-weight: 500;
      border: 1px solid rgba(255,255,255,0.15); background: none;
      cursor: pointer; transition: all 0.2s ease;
    }
    .logout-btn:hover { background: rgba(233,69,96,0.15); color: #e94560; border-color: rgba(233,69,96,0.4); }
    .logout-btn mat-icon, .nav-link mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .main-content { max-width: 1280px; margin: 0 auto; padding: 32px; min-height: calc(100vh - 64px); background: #f0f2f5; }
    :host { display: block; background: #f0f2f5; }
  `]
})
export class LayoutComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
