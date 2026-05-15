import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="login-page">
      <div class="login-left">
        <!-- Animated background -->
        <div class="bg-gradient"></div>
        <div class="bg-grid"></div>
        <div class="bg-glow glow-1"></div>
        <div class="bg-glow glow-2"></div>
        <div class="bg-glow glow-3"></div>

        <!-- Floating particles -->
        <div class="particle p1"></div>
        <div class="particle p2"></div>
        <div class="particle p3"></div>
        <div class="particle p4"></div>
        <div class="particle p5"></div>
        <div class="particle p6"></div>

        <!-- Central mockup screen -->
        <div class="scene">
          <div class="mockup">
            <div class="mockup-bar">
              <div class="bar-dots"><span></span><span></span><span></span></div>
              <span class="bar-title">TecPay Dashboard</span>
              <div class="bar-actions"><mat-icon>remove</mat-icon><mat-icon>crop_square</mat-icon></div>
            </div>
            <div class="mockup-body">
              <div class="mock-sidebar">
                <div class="sb-logo"><mat-icon>inventory_2</mat-icon></div>
                <div class="sb-item active"><mat-icon>dashboard</mat-icon></div>
                <div class="sb-item"><mat-icon>inventory</mat-icon></div>
                <div class="sb-item"><mat-icon>category</mat-icon></div>
                <div class="sb-item"><mat-icon>bar_chart</mat-icon></div>
                <div class="sb-item"><mat-icon>settings</mat-icon></div>
              </div>
              <div class="mock-content">
                <div class="mock-stats">
                  <div class="ms-card">
                    <span class="ms-num count-up">1,247</span>
                    <span class="ms-label">Productos</span>
                    <div class="ms-bar"><div class="ms-fill" style="width:78%"></div></div>
                  </div>
                  <div class="ms-card">
                    <span class="ms-num count-up">$84.5K</span>
                    <span class="ms-label">Ingresos</span>
                    <div class="ms-bar green"><div class="ms-fill" style="width:92%"></div></div>
                  </div>
                  <div class="ms-card">
                    <span class="ms-num count-up">384</span>
                    <span class="ms-label">Ordenes</span>
                    <div class="ms-bar blue"><div class="ms-fill" style="width:64%"></div></div>
                  </div>
                </div>
                <div class="mock-chart">
                  <svg viewBox="0 0 200 60" class="line-chart">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#e94560" stop-opacity="0.3"/>
                        <stop offset="100%" stop-color="#e94560" stop-opacity="0"/>
                      </linearGradient>
                    </defs>
                    <path class="chart-area" d="M0,50 Q20,45 40,35 T80,28 T120,18 T160,22 T200,10 V60 H0 Z" fill="url(#chartGrad)"/>
                    <path class="chart-line" d="M0,50 Q20,45 40,35 T80,28 T120,18 T160,22 T200,10" fill="none" stroke="#e94560" stroke-width="2"/>
                    <circle class="chart-dot" cx="200" cy="10" r="3" fill="#e94560"/>
                  </svg>
                </div>
                <div class="mock-rows">
                  <div class="mr-row"><span class="mr-dot"></span><span class="mr-text"></span><span class="mr-badge">Activo</span></div>
                  <div class="mr-row"><span class="mr-dot blue"></span><span class="mr-text short"></span><span class="mr-val">$299</span></div>
                  <div class="mr-row"><span class="mr-dot green"></span><span class="mr-text"></span><span class="mr-badge green">Nuevo</span></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Floating badges around mockup -->
          <div class="badge-float bf-1">
            <mat-icon>trending_up</mat-icon>
            <span>+12.5%</span>
          </div>
          <div class="badge-float bf-2">
            <mat-icon>verified</mat-icon>
            <span>Seguro</span>
          </div>
          <div class="badge-float bf-3">
            <mat-icon>speed</mat-icon>
            <span>Rapido</span>
          </div>

          <!-- Orbiting ring -->
          <div class="orbit-ring">
            <div class="orbit-dot od-1"></div>
            <div class="orbit-dot od-2"></div>
            <div class="orbit-dot od-3"></div>
          </div>
        </div>

        <!-- Brand -->
        <div class="brand-area">
          <div class="brand-logo">
            <mat-icon>inventory_2</mat-icon>
          </div>
          <h1>TecPay</h1>
          <p class="brand-tagline">Sistema de Catalogo de Productos</p>
          <p class="brand-desc">Plataforma integral para la gestion y administracion de tu inventario de productos.</p>
        </div>
      </div>
      <div class="login-right">
        <div class="login-form-area">
          <h2>Bienvenido</h2>
          <p class="form-subtitle">Inicia sesion para continuar</p>

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="input-group">
              <label>Usuario</label>
              <div class="input-wrap" [class.focused]="userFocused">
                <mat-icon>person_outline</mat-icon>
                <input formControlName="username" placeholder="Ingresa tu usuario"
                  (focus)="userFocused=true" (blur)="userFocused=false">
              </div>
            </div>

            <div class="input-group">
              <label>Contrasena</label>
              <div class="input-wrap" [class.focused]="passFocused">
                <mat-icon>lock_outline</mat-icon>
                <input [type]="hidePassword ? 'password' : 'text'" formControlName="password"
                  placeholder="Ingresa tu contrasena"
                  (focus)="passFocused=true" (blur)="passFocused=false">
                <button type="button" class="toggle-pass" (click)="hidePassword = !hidePassword">
                  <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </div>
            </div>

            @if (errorMessage) {
              <div class="error-banner">
                <mat-icon>error_outline</mat-icon>
                {{ errorMessage }}
              </div>
            }

            <button type="submit" class="login-btn" [disabled]="form.invalid || loading">
              @if (loading) {
                <mat-spinner diameter="20" class="spinner"></mat-spinner>
              }
              {{ loading ? 'Verificando...' : 'Iniciar Sesion' }}
              @if (!loading) { <mat-icon>arrow_forward</mat-icon> }
            </button>
          </form>

          <div class="hint-box">
            <div class="hint-header">
              <mat-icon>info</mat-icon>
              <strong>Credenciales de prueba</strong>
            </div>
            <p>Precargadas intencionalmente para agilizar la evaluacion tecnica.</p>
            <div class="cred-chips">
              <span class="cred-chip"><mat-icon>person</mat-icon> admin</span>
              <span class="cred-chip"><mat-icon>key</mat-icon> TecPay2025!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .login-page { display: flex; min-height: 100vh; }

    /* ===== LEFT PANEL ===== */
    .login-left {
      flex: 0 0 48%; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: linear-gradient(160deg, #0d0d1a 0%, #1a1a2e 35%, #16213e 65%, #0f3460 100%);
      position: relative; overflow: hidden;
    }

    /* --- Background layers --- */
    .bg-gradient {
      position: absolute; inset: 0;
      background:
        radial-gradient(ellipse 80% 60% at 20% 80%, rgba(233,69,96,0.08) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 20%, rgba(15,52,96,0.15) 0%, transparent 60%);
    }
    .bg-grid {
      position: absolute; inset: 0; opacity: 0.03;
      background-image:
        linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px);
      background-size: 32px 32px;
      animation: grid-scroll 25s linear infinite;
    }
    @keyframes grid-scroll {
      0% { transform: translate(0,0); }
      100% { transform: translate(32px,32px); }
    }

    .bg-glow {
      position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
    }
    .glow-1 {
      width: 300px; height: 300px; top: -60px; right: -60px;
      background: rgba(233,69,96,0.12);
      animation: glow-drift 12s ease-in-out infinite;
    }
    .glow-2 {
      width: 250px; height: 250px; bottom: 15%; left: -40px;
      background: rgba(66,165,245,0.08);
      animation: glow-drift 15s ease-in-out infinite 4s;
    }
    .glow-3 {
      width: 200px; height: 200px; top: 40%; right: 20%;
      background: rgba(233,69,96,0.06);
      animation: glow-drift 10s ease-in-out infinite 2s;
    }
    @keyframes glow-drift {
      0%, 100% { transform: translate(0,0) scale(1); opacity: 0.5; }
      50% { transform: translate(20px,-15px) scale(1.2); opacity: 1; }
    }

    /* --- Particles --- */
    .particle {
      position: absolute; border-radius: 50%; pointer-events: none;
      background: rgba(233,69,96,0.5);
    }
    .p1 { width: 4px; height: 4px; top: 12%; left: 15%; animation: rise 8s linear infinite; }
    .p2 { width: 3px; height: 3px; top: 25%; left: 75%; animation: rise 11s linear infinite 2s; background: rgba(66,165,245,0.5); }
    .p3 { width: 5px; height: 5px; top: 60%; left: 25%; animation: rise 9s linear infinite 4s; }
    .p4 { width: 3px; height: 3px; top: 70%; left: 65%; animation: rise 13s linear infinite 1s; background: rgba(76,175,80,0.5); }
    .p5 { width: 4px; height: 4px; top: 45%; left: 85%; animation: rise 10s linear infinite 3s; background: rgba(255,152,0,0.5); }
    .p6 { width: 3px; height: 3px; top: 80%; left: 45%; animation: rise 12s linear infinite 5s; }
    @keyframes rise {
      0% { transform: translateY(0) scale(1); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-120px) scale(0); opacity: 0; }
    }

    /* --- Scene (mockup + badges + orbit) --- */
    .scene {
      position: relative; z-index: 2; width: 380px; height: 280px;
      margin-bottom: 40px;
      animation: scene-float 8s ease-in-out infinite;
    }
    @keyframes scene-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    /* --- Mockup screen --- */
    .mockup {
      width: 100%; height: 100%; border-radius: 16px; overflow: hidden;
      background: #12121f;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow:
        0 25px 60px rgba(0,0,0,0.5),
        0 0 0 1px rgba(255,255,255,0.05),
        0 0 80px rgba(233,69,96,0.08);
      animation: mockup-appear 1s ease-out;
    }
    @keyframes mockup-appear {
      0% { transform: scale(0.9) translateY(20px); opacity: 0; }
      100% { transform: scale(1) translateY(0); opacity: 1; }
    }
    .mockup-bar {
      display: flex; align-items: center; padding: 10px 14px;
      background: #1a1a2e; border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .bar-dots { display: flex; gap: 6px; }
    .bar-dots span {
      width: 10px; height: 10px; border-radius: 50%;
    }
    .bar-dots span:nth-child(1) { background: #e94560; }
    .bar-dots span:nth-child(2) { background: #f59e0b; }
    .bar-dots span:nth-child(3) { background: #4caf50; }
    .bar-title {
      flex: 1; text-align: center; font-size: 0.65rem; font-weight: 600;
      color: rgba(255,255,255,0.35); letter-spacing: 0.5px;
    }
    .bar-actions { display: flex; gap: 4px; }
    .bar-actions mat-icon { font-size: 12px; width: 12px; height: 12px; color: rgba(255,255,255,0.2); }

    .mockup-body { display: flex; height: calc(100% - 38px); }

    /* Sidebar */
    .mock-sidebar {
      width: 44px; background: #161627; display: flex; flex-direction: column;
      align-items: center; padding: 10px 0; gap: 6px;
      border-right: 1px solid rgba(255,255,255,0.04);
    }
    .sb-logo {
      width: 28px; height: 28px; border-radius: 8px;
      background: linear-gradient(135deg, #e94560, #c23152);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 8px;
    }
    .sb-logo mat-icon { font-size: 14px; width: 14px; height: 14px; color: #fff; }
    .sb-item {
      width: 30px; height: 30px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .sb-item mat-icon { font-size: 16px; width: 16px; height: 16px; color: rgba(255,255,255,0.2); }
    .sb-item.active { background: rgba(233,69,96,0.15); }
    .sb-item.active mat-icon { color: #e94560; }

    /* Content area */
    .mock-content { flex: 1; padding: 12px; overflow: hidden; }

    /* Stats row */
    .mock-stats { display: flex; gap: 8px; margin-bottom: 10px; }
    .ms-card {
      flex: 1; background: rgba(255,255,255,0.04); border-radius: 8px;
      padding: 8px 10px; border: 1px solid rgba(255,255,255,0.04);
    }
    .ms-num {
      display: block; font-size: 0.85rem; font-weight: 800; color: #fff;
      animation: count-anim 2s ease-out;
    }
    @keyframes count-anim {
      0% { opacity: 0; transform: translateY(6px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .ms-label { display: block; font-size: 0.5rem; color: rgba(255,255,255,0.3); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
    .ms-bar {
      height: 3px; background: rgba(255,255,255,0.06); border-radius: 3px; margin-top: 6px; overflow: hidden;
    }
    .ms-fill {
      height: 100%; border-radius: 3px;
      background: linear-gradient(90deg, #e94560, #ff6b81);
      animation: fill-grow 2s ease-out forwards;
      transform-origin: left;
    }
    .ms-bar.green .ms-fill { background: linear-gradient(90deg, #4caf50, #69f0ae); }
    .ms-bar.blue .ms-fill { background: linear-gradient(90deg, #42a5f5, #80d8ff); }
    @keyframes fill-grow {
      0% { transform: scaleX(0); }
      100% { transform: scaleX(1); }
    }

    /* Chart */
    .mock-chart {
      background: rgba(255,255,255,0.03); border-radius: 8px; padding: 8px;
      margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.04);
    }
    .line-chart { width: 100%; height: 50px; }
    .chart-line {
      stroke-dasharray: 400; stroke-dashoffset: 400;
      animation: draw-line 3s ease-out 0.5s forwards;
    }
    .chart-area {
      opacity: 0;
      animation: fade-area 1s ease-out 2.5s forwards;
    }
    .chart-dot {
      opacity: 0;
      animation: pop-dot 0.3s ease-out 3s forwards;
    }
    @keyframes draw-line {
      100% { stroke-dashoffset: 0; }
    }
    @keyframes fade-area {
      100% { opacity: 1; }
    }
    @keyframes pop-dot {
      0% { r: 0; opacity: 0; }
      100% { r: 3; opacity: 1; }
    }

    /* Table rows */
    .mock-rows { display: flex; flex-direction: column; gap: 5px; }
    .mr-row {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 10px; border-radius: 6px;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.03);
      animation: row-slide 0.5s ease-out forwards;
      opacity: 0;
    }
    .mr-row:nth-child(1) { animation-delay: 1.8s; }
    .mr-row:nth-child(2) { animation-delay: 2s; }
    .mr-row:nth-child(3) { animation-delay: 2.2s; }
    @keyframes row-slide {
      0% { transform: translateX(-10px); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    .mr-dot { width: 6px; height: 6px; border-radius: 50%; background: #e94560; flex-shrink: 0; }
    .mr-dot.blue { background: #42a5f5; }
    .mr-dot.green { background: #4caf50; }
    .mr-text {
      flex: 1; height: 6px; border-radius: 3px;
      background: rgba(255,255,255,0.08);
    }
    .mr-text.short { max-width: 60%; }
    .mr-badge {
      font-size: 0.45rem; padding: 2px 8px; border-radius: 10px;
      background: rgba(233,69,96,0.15); color: #e94560;
      font-weight: 700; text-transform: uppercase;
    }
    .mr-badge.green { background: rgba(76,175,80,0.15); color: #4caf50; }
    .mr-val { font-size: 0.55rem; color: rgba(255,255,255,0.5); font-weight: 700; }

    /* --- Floating badges --- */
    .badge-float {
      position: absolute; display: flex; align-items: center; gap: 6px;
      background: rgba(255,255,255,0.1); backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.15); border-radius: 12px;
      padding: 8px 14px; color: #fff; font-size: 0.7rem; font-weight: 700;
      box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    }
    .badge-float mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .bf-1 {
      top: -12px; right: -30px; animation: badge-bob 5s ease-in-out infinite;
    }
    .bf-1 mat-icon { color: #69f0ae; }
    .bf-2 {
      bottom: 30px; right: -40px; animation: badge-bob 6s ease-in-out infinite 1.5s;
    }
    .bf-2 mat-icon { color: #42a5f5; }
    .bf-3 {
      top: 40px; left: -35px; animation: badge-bob 7s ease-in-out infinite 3s;
    }
    .bf-3 mat-icon { color: #f59e0b; }
    @keyframes badge-bob {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-8px) scale(1.05); }
    }

    /* --- Orbit ring --- */
    .orbit-ring {
      position: absolute; top: 50%; left: 50%;
      width: 440px; height: 320px;
      margin-top: -160px; margin-left: -220px;
      border: 1px solid rgba(233,69,96,0.08);
      border-radius: 50%; pointer-events: none;
      animation: orbit-spin 30s linear infinite;
    }
    .orbit-dot {
      position: absolute; width: 8px; height: 8px;
      border-radius: 50%; background: #e94560;
      box-shadow: 0 0 12px rgba(233,69,96,0.6);
    }
    .od-1 { top: -4px; left: 50%; }
    .od-2 { bottom: -4px; left: 30%; background: #42a5f5; box-shadow: 0 0 12px rgba(66,165,245,0.6); }
    .od-3 { top: 50%; right: -4px; background: #4caf50; box-shadow: 0 0 12px rgba(76,175,80,0.6); }
    @keyframes orbit-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* --- Brand area --- */
    .brand-area {
      position: relative; z-index: 3; color: #fff;
      text-align: center; padding: 0 48px 40px;
    }
    .brand-logo {
      width: 56px; height: 56px; border-radius: 14px;
      background: linear-gradient(135deg, #e94560, #c23152);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px; box-shadow: 0 8px 30px rgba(233,69,96,0.4);
      animation: logo-pulse 4s ease-in-out infinite;
    }
    @keyframes logo-pulse {
      0%, 100% { box-shadow: 0 8px 30px rgba(233,69,96,0.4); transform: scale(1); }
      50% { box-shadow: 0 8px 45px rgba(233,69,96,0.6), 0 0 60px rgba(233,69,96,0.15); transform: scale(1.05); }
    }
    .brand-logo mat-icon { font-size: 28px; width: 28px; height: 28px; color: #fff; }
    .brand-area h1 { font-size: 2.2rem; font-weight: 900; margin: 0 0 6px; letter-spacing: 1.5px; }
    .brand-tagline { font-size: 0.9rem; color: rgba(255,255,255,0.5); margin: 0 0 8px; font-weight: 400; }
    .brand-desc { font-size: 0.8rem; color: rgba(255,255,255,0.3); margin: 0; line-height: 1.5; max-width: 340px; margin-left: auto; margin-right: auto; }


    .login-right {
      flex: 1; display: flex; align-items: center; justify-content: center;
      background: #f8f9fc; padding: 60px;
    }
    .login-form-area { width: 100%; max-width: 440px; }
    .login-form-area h2 { font-size: 2.2rem; font-weight: 800; color: #1a1a2e; margin: 0 0 8px; }
    .form-subtitle { color: #8a8a9a; margin: 0 0 40px; font-size: 1rem; }

    .input-group { margin-bottom: 28px; }
    .input-group label { display: block; font-size: 0.8rem; font-weight: 700; color: #555; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .input-wrap {
      display: flex; align-items: center; gap: 12px;
      background: #fff; border: 2px solid #e8e8e8; border-radius: 12px;
      padding: 0 16px; transition: all 0.25s ease;
    }
    .input-wrap.focused { border-color: #e94560; box-shadow: 0 0 0 4px rgba(233,69,96,0.1); }
    .input-wrap mat-icon { color: #bbb; font-size: 20px; width: 20px; height: 20px; }
    .input-wrap input {
      flex: 1; border: none; outline: none; padding: 16px 0;
      font-size: 1rem; color: #333; background: none;
    }
    .input-wrap input::placeholder { color: #ccc; }
    .toggle-pass {
      background: none; border: none; cursor: pointer; padding: 4px;
      color: #bbb; display: flex; align-items: center;
    }
    .toggle-pass:hover { color: #666; }

    .error-banner {
      display: flex; align-items: center; gap: 10px;
      background: linear-gradient(135deg, #fff5f5, #ffe0e0); color: #c62828;
      padding: 12px 16px; border-radius: 12px; margin-bottom: 16px;
      border-left: 4px solid #e53935; font-size: 0.9rem;
    }

    .login-btn {
      width: 100%; padding: 16px 24px; border: none; border-radius: 12px;
      background: linear-gradient(135deg, #e94560, #c23152);
      color: #fff; font-size: 1rem; font-weight: 700; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: all 0.3s ease; margin-top: 8px;
      box-shadow: 0 4px 15px rgba(233,69,96,0.35);
    }
    .login-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(233,69,96,0.45); }
    .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .login-btn mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .spinner { display: inline-block; }
    :host ::ng-deep .spinner .mdc-circular-progress__indeterminate-circle-graphic { stroke: #fff !important; }

    .hint-box {
      margin-top: 28px; padding: 16px 20px; border-radius: 12px;
      background: linear-gradient(135deg, #fffbf0, #fff8e6);
      border: 1px solid #ffe0a0;
    }
    .hint-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .hint-header mat-icon { color: #f59e0b; font-size: 20px; width: 20px; height: 20px; }
    .hint-header strong { color: #92400e; font-size: 0.85rem; }
    .hint-box p { color: #a16207; font-size: 0.8rem; margin: 0 0 12px; line-height: 1.4; }
    .cred-chips { display: flex; gap: 10px; }
    .cred-chip {
      display: flex; align-items: center; gap: 6px;
      background: #fff; padding: 6px 14px; border-radius: 8px;
      font-size: 0.85rem; font-weight: 700; color: #1a1a2e;
      border: 1px solid #e8e8e8;
    }
    .cred-chip mat-icon { font-size: 16px; width: 16px; height: 16px; color: #e94560; }

    @media (max-width: 900px) {
      .login-page { flex-direction: column; }
      .login-left { min-height: 320px; padding: 40px 20px; }
      .scene { transform: scale(0.7); margin-bottom: 10px; }
      .brand-area h1 { font-size: 1.8rem; }
      .badge-float { display: none; }
      .orbit-ring { display: none; }
      .login-right { padding: 40px 24px; }
    }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  errorMessage = '';
  hidePassword = true;
  userFocused = false;
  passFocused = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['admin', Validators.required],
      password: ['TecPay2025!', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Credenciales invalidas';
      }
    });
  }
}
