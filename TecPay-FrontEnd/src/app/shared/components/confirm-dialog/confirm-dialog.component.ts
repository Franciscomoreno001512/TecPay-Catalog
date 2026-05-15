import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-icon">
        <mat-icon>warning_amber</mat-icon>
      </div>
      <h2>{{ data.title }}</h2>
      <p>{{ data.message }}</p>
      <div class="dialog-actions">
        <button class="btn-cancel" (click)="dialogRef.close(false)">
          <mat-icon>close</mat-icon>
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button class="btn-confirm" (click)="dialogRef.close(true)">
          <mat-icon>delete_outline</mat-icon>
          {{ data.confirmText || 'Eliminar' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container { text-align: center; padding: 32px 28px 24px; }
    .dialog-icon {
      width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 20px;
      background: linear-gradient(135deg, #fff5f5, #ffe0e0);
      display: flex; align-items: center; justify-content: center;
    }
    .dialog-icon mat-icon {
      font-size: 36px; width: 36px; height: 36px; color: #e53935;
    }
    h2 {
      margin: 0 0 10px; font-size: 1.4rem; font-weight: 800; color: #1a1a2e;
    }
    p {
      margin: 0 0 28px; color: #8a8a9a; font-size: 0.95rem; line-height: 1.5;
    }
    .dialog-actions { display: flex; gap: 12px; justify-content: center; }
    .btn-cancel {
      display: flex; align-items: center; gap: 6px;
      padding: 12px 28px; border-radius: 12px;
      background: #fff; color: #666; border: 1px solid #ddd;
      font-size: 0.9rem; font-weight: 600; cursor: pointer;
      transition: all 0.2s;
    }
    .btn-cancel:hover { background: #f5f5f5; color: #333; }
    .btn-cancel mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .btn-confirm {
      display: flex; align-items: center; gap: 6px;
      padding: 12px 28px; border-radius: 12px; border: none;
      background: linear-gradient(135deg, #e53935, #c62828);
      color: #fff; font-size: 0.9rem; font-weight: 700;
      cursor: pointer; transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(229,57,53,0.35);
    }
    .btn-confirm:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(229,57,53,0.45); }
    .btn-confirm mat-icon { font-size: 18px; width: 18px; height: 18px; }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
