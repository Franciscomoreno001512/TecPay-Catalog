import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found-page">
      <div class="not-found-card">
        <div class="error-code">404</div>
        <div class="error-icon">
          <mat-icon>search_off</mat-icon>
        </div>
        <h1>Pagina no encontrada</h1>
        <p>La ruta que intentas acceder no existe o fue removida.<br>Verifica la URL e intenta nuevamente.</p>
        <a routerLink="/products" class="back-btn">
          <mat-icon>home</mat-icon>
          Ir al Inicio
        </a>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page {
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; background: #f0f2f5;
      padding: 20px;
    }
    .not-found-card {
      text-align: center; padding: 60px 40px;
      background: #fff; border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      max-width: 500px; width: 100%;
    }
    .error-code {
      font-size: 7rem; font-weight: 900;
      background: linear-gradient(135deg, #1a1a2e, #e94560);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; line-height: 1; margin-bottom: 16px;
    }
    .error-icon mat-icon {
      font-size: 64px; width: 64px; height: 64px;
      color: #ccc; margin-bottom: 16px;
    }
    h1 {
      font-size: 1.5rem; font-weight: 800; color: #1a1a2e;
      margin: 0 0 12px;
    }
    p {
      color: #8a8a9a; font-size: 0.95rem; line-height: 1.6;
      margin: 0 0 32px;
    }
    .back-btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 32px; border-radius: 12px;
      background: linear-gradient(135deg, #e94560, #c23152);
      color: #fff; text-decoration: none;
      font-weight: 700; font-size: 0.95rem;
      box-shadow: 0 4px 15px rgba(233,69,96,0.35);
      transition: all 0.3s ease;
    }
    .back-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(233,69,96,0.45); }
    .back-btn mat-icon { font-size: 20px; width: 20px; height: 20px; }
  `]
})
export class NotFoundComponent {}
