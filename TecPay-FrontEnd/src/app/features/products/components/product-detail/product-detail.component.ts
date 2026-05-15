import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    @if (product) {
      <div class="page-header">
        <div>
          <h1>
            <button class="back-btn" (click)="router.navigate(['/products'])">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <mat-icon class="title-icon">visibility</mat-icon>
            Detalle del Producto
          </h1>
          <p class="subtitle">Informacion completa del producto seleccionado</p>
        </div>
      </div>

      <div class="detail-container">
        <div class="detail-section">
          <div class="section-header">
            <mat-icon>inventory_2</mat-icon>
            <span>Producto</span>
            <span [class]="product.isActive ? 'status-chip active' : 'status-chip inactive'">
              <span class="status-dot"></span>{{ product.isActive ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
          <div class="section-body">
            <div class="product-hero">
              <div class="product-avatar">
                <mat-icon>inventory_2</mat-icon>
              </div>
              <div class="product-info">
                <h2>{{ product.name }}</h2>
                <code>{{ product.sku }}</code>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <div class="section-header">
            <mat-icon>info</mat-icon>
            <span>Informacion General</span>
          </div>
          <div class="section-body">
            <div class="info-grid">
              <div class="info-card">
                <div class="info-icon price-icon">
                  <mat-icon>attach_money</mat-icon>
                </div>
                <div>
                  <span class="info-label">Precio</span>
                  <span class="info-value price-value">\${{ product.price | number:'1.2-2' }}</span>
                </div>
              </div>
              <div class="info-card">
                <div class="info-icon stock-icon">
                  <mat-icon>inventory</mat-icon>
                </div>
                <div>
                  <span class="info-label">Stock</span>
                  <span class="info-value">
                    <span [class]="product.stock < 10 ? 'badge-danger' : 'badge-success'">{{ product.stock }} unidades</span>
                  </span>
                </div>
              </div>
              <div class="info-card">
                <div class="info-icon cat-icon">
                  <mat-icon>category</mat-icon>
                </div>
                <div>
                  <span class="info-label">Categoria</span>
                  <span class="info-value"><span class="cat-tag">{{ product.categoryName }}</span></span>
                </div>
              </div>
              <div class="info-card">
                <div class="info-icon date-icon">
                  <mat-icon>calendar_today</mat-icon>
                </div>
                <div>
                  <span class="info-label">Fecha de Creacion</span>
                  <span class="info-value">{{ product.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        @if (product.description) {
          <div class="detail-section">
            <div class="section-header">
              <mat-icon>description</mat-icon>
              <span>Descripcion</span>
            </div>
            <div class="section-body">
              <p class="description-text">{{ product.description }}</p>
            </div>
          </div>
        }

        <div class="detail-actions">
          <button class="btn-back" (click)="router.navigate(['/products'])">
            <mat-icon>arrow_back</mat-icon> Volver al listado
          </button>
          <button class="btn-edit" (click)="router.navigate(['/products', product.id, 'edit'])">
            <mat-icon>edit</mat-icon> Editar Producto
          </button>
        </div>
      </div>
    } @else {
      <div class="loading-center">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .page-header { margin-bottom: 28px; max-width: 820px; margin-left: auto; margin-right: auto; }
    h1 {
      margin: 0; font-size: 1.8rem; font-weight: 800; color: #1a1a2e;
      display: flex; align-items: center; gap: 10px;
    }
    .title-icon { font-size: 28px; width: 28px; height: 28px; color: #e94560; }
    .subtitle { margin: 6px 0 0; color: #8a8a9a; font-size: 0.9rem; }
    .back-btn {
      width: 40px; height: 40px; border-radius: 10px; border: none;
      background: #fff; color: #1a1a2e; cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: all 0.2s;
    }
    .back-btn:hover { background: #f0f2f5; transform: translateX(-2px); }
    .back-btn mat-icon { font-size: 20px; width: 20px; height: 20px; }

    .detail-container { max-width: 820px; margin: 0 auto; }

    .detail-section {
      background: #fff; border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      margin-bottom: 20px; overflow: hidden;
    }
    .section-header {
      display: flex; align-items: center; gap: 10px;
      padding: 16px 28px;
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      color: #fff; font-weight: 700; font-size: 0.9rem;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .section-header mat-icon { font-size: 20px; width: 20px; height: 20px; color: #e94560; }
    .section-body { padding: 28px; }

    .status-chip {
      margin-left: auto; display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 700;
      text-transform: none; letter-spacing: 0;
    }
    .status-chip.active { background: rgba(76,175,80,0.15); color: #4caf50; }
    .status-chip.inactive { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.6); }
    .status-dot {
      width: 8px; height: 8px; border-radius: 50%; display: inline-block;
    }
    .status-chip.active .status-dot { background: #4caf50; }
    .status-chip.inactive .status-dot { background: rgba(255,255,255,0.4); }

    .product-hero { display: flex; align-items: center; gap: 20px; }
    .product-avatar {
      width: 64px; height: 64px; border-radius: 16px;
      background: linear-gradient(135deg, #1a1a2e, #0f3460);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 15px rgba(26,26,46,0.25); flex-shrink: 0;
    }
    .product-avatar mat-icon { font-size: 32px; width: 32px; height: 32px; color: #fff; }
    .product-info h2 { margin: 0 0 8px; font-size: 1.4rem; font-weight: 800; color: #1a1a2e; }
    .product-info code {
      background: #f0f2f5; padding: 5px 14px; border-radius: 8px;
      font-size: 0.85rem; color: #666; font-family: 'Consolas', monospace;
    }

    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .info-card {
      display: flex; align-items: center; gap: 16px;
      padding: 20px; background: #f8f9fc; border-radius: 14px;
      border: 2px solid #e8e8e8; transition: all 0.2s;
    }
    .info-card:hover { border-color: #e94560; background: #fff; box-shadow: 0 0 0 4px rgba(233,69,96,0.06); }
    .info-icon {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .info-icon mat-icon { font-size: 24px; width: 24px; height: 24px; }
    .price-icon { background: linear-gradient(135deg, #e3f2fd, #bbdefb); }
    .price-icon mat-icon { color: #0f3460; }
    .stock-icon { background: linear-gradient(135deg, #e8f5e9, #c8e6c9); }
    .stock-icon mat-icon { color: #2e7d32; }
    .cat-icon { background: linear-gradient(135deg, #e8eaf6, #c5cae9); }
    .cat-icon mat-icon { color: #3949ab; }
    .date-icon { background: linear-gradient(135deg, #fff3e0, #ffe0b2); }
    .date-icon mat-icon { color: #e65100; }
    .info-label {
      display: block; font-size: 0.75rem; text-transform: uppercase;
      color: #8a8a9a; font-weight: 700; letter-spacing: 0.5px;
    }
    .info-value { display: block; font-size: 1rem; color: #1a1a2e; margin-top: 4px; font-weight: 600; }
    .price-value { font-weight: 800 !important; color: #0f3460 !important; font-size: 1.3rem !important; }
    .badge-success {
      background: #e8f5e9; color: #2e7d32; padding: 4px 12px;
      border-radius: 20px; font-size: 0.85rem; font-weight: 600;
    }
    .badge-danger {
      background: #fce4ec; color: #c62828; padding: 4px 12px;
      border-radius: 20px; font-size: 0.85rem; font-weight: 600;
    }
    .cat-tag {
      background: #e8eaf6; color: #3949ab; padding: 4px 14px;
      border-radius: 8px; font-size: 0.85rem; font-weight: 600;
    }

    .description-text {
      margin: 0; color: #555; font-size: 0.95rem; line-height: 1.7;
    }

    .detail-actions {
      display: flex; gap: 16px; justify-content: flex-end; margin-top: 8px;
    }
    .btn-back {
      display: flex; align-items: center; gap: 8px;
      padding: 14px 28px; border-radius: 12px;
      background: #fff; color: #666; border: 1px solid #ddd;
      font-size: 0.9rem; font-weight: 600; cursor: pointer;
      transition: all 0.2s;
    }
    .btn-back:hover { background: #f5f5f5; color: #333; }
    .btn-back mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .btn-edit {
      display: flex; align-items: center; gap: 8px;
      padding: 14px 32px; border-radius: 12px; border: none;
      background: linear-gradient(135deg, #e94560, #c23152);
      color: #fff; font-size: 0.9rem; font-weight: 700;
      cursor: pointer; transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(233,69,96,0.35);
    }
    .btn-edit:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(233,69,96,0.45); }
    .btn-edit mat-icon { font-size: 20px; width: 20px; height: 20px; }

    .loading-center { display: flex; justify-content: center; padding: 80px 0; }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getById(id).subscribe({
      next: (res) => this.product = res.data,
      error: () => this.router.navigate(['/products'])
    });
  }
}
