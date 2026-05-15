import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ProductService } from '../../../../core/services/product.service';
import { CategoryService } from '../../../../core/services/category.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule, MatPaginatorModule, MatProgressBarModule, MatTooltipModule, MatSnackBarModule, MatSortModule, MatDialogModule],
  template: `
    <div class="page-header">
      <div>
        <h1><mat-icon class="title-icon">inventory</mat-icon> Productos</h1>
        <p class="subtitle">Gestiona tu catalogo de productos</p>
      </div>
      <button class="btn-primary" (click)="router.navigate(['/products/new'])">
        <mat-icon>add_circle</mat-icon>
        Nuevo Producto
      </button>
    </div>

    <div class="filters-card">
      <div class="filters-row">
        <div class="search-wrap">
          <mat-icon class="search-icon">search</mat-icon>
          <input [(ngModel)]="search" placeholder="Buscar por nombre o SKU..." (keyup.enter)="loadProducts()" (input)="onSearchInput()" class="search-input">
        </div>
        <div class="select-custom">
          <mat-icon class="sel-icon">category</mat-icon>
          <mat-select [(ngModel)]="selectedCategory" (selectionChange)="loadProducts()" placeholder="Todas las categorias" panelClass="custom-select-panel">
            <mat-option [value]="null">Todas</mat-option>
            @for (cat of categoryService.categories(); track cat.id) {
              <mat-option [value]="cat.id">{{ cat.name }}</mat-option>
            }
          </mat-select>
        </div>
        <button class="btn-clear" (click)="clearFilters()">
          <mat-icon>refresh</mat-icon> Limpiar
        </button>
      </div>
    </div>

    @if (productService.loading()) {
      <mat-progress-bar mode="indeterminate" color="accent" class="loading-bar"></mat-progress-bar>
    }

    <div class="table-container">
      <table mat-table [dataSource]="dataSource" matSort matSortActive="id" matSortDirection="asc" (matSortChange)="onSortChange($event)" class="product-table">

        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
          <td mat-cell *matCellDef="let p"><span class="id-badge">{{ p.id }}</span></td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
          <td mat-cell *matCellDef="let p" class="name-cell">{{ p.name }}</td>
        </ng-container>

        <ng-container matColumnDef="sku">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>SKU</th>
          <td mat-cell *matCellDef="let p"><code>{{ p.sku }}</code></td>
        </ng-container>

        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Precio</th>
          <td mat-cell *matCellDef="let p" class="price">\${{ p.price | number:'1.2-2' }}</td>
        </ng-container>

        <ng-container matColumnDef="stock">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Stock</th>
          <td mat-cell *matCellDef="let p">
            <span [class]="p.stock < 10 ? 'badge-danger' : 'badge-success'">{{ p.stock }} uds</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="categoryName">Categoria</th>
          <td mat-cell *matCellDef="let p"><span class="cat-tag">{{ p.categoryName }}</span></td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="isActive">Estado</th>
          <td mat-cell *matCellDef="let p">
            <span [class]="p.isActive ? 'status-active' : 'status-inactive'">
              <span class="status-dot"></span>{{ p.isActive ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef class="actions-header">Acciones</th>
          <td mat-cell *matCellDef="let p" class="actions-cell">
            <button class="action-btn view" matTooltip="Ver detalle" (click)="router.navigate(['/products', p.id])">
              <mat-icon>visibility</mat-icon>
            </button>
            <button class="action-btn edit" matTooltip="Editar" (click)="router.navigate(['/products', p.id, 'edit'])">
              <mat-icon>edit</mat-icon>
            </button>
            <button class="action-btn delete" matTooltip="Eliminar" (click)="deleteProduct(p.id, p.name)">
              <mat-icon>delete_outline</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
      </table>

      @if (productService.products().length === 0 && !productService.loading()) {
        <div class="empty-state">
          <mat-icon>inbox</mat-icon>
          <p>No se encontraron productos</p>
          <span>Intenta cambiar los filtros o crea un nuevo producto</span>
        </div>
      }

      <mat-paginator
        [length]="productService.totalCount()"
        [pageSize]="productService.pageSize()"
        [pageIndex]="productService.currentPage() - 1"
        [pageSizeOptions]="[5, 10, 25]"
        (page)="onPageChange($event)"
        showFirstLastButtons>
      </mat-paginator>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
    h1 { margin: 0; font-size: 1.8rem; font-weight: 800; color: #1a1a2e; display: flex; align-items: center; gap: 10px; }
    .title-icon { font-size: 28px; width: 28px; height: 28px; color: #e94560; }
    .subtitle { margin: 6px 0 0; color: #8a8a9a; font-size: 0.9rem; font-weight: 400; }
    .btn-primary {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 24px; border: none; border-radius: 12px;
      background: linear-gradient(135deg, #e94560, #c23152);
      color: #fff; font-size: 0.9rem; font-weight: 600;
      cursor: pointer; transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(233,69,96,0.35);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(233,69,96,0.45); }
    .btn-primary mat-icon { font-size: 20px; width: 20px; height: 20px; }

    .filters-card {
      background: #fff; border-radius: 16px; padding: 24px 28px;
      margin-bottom: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }
    .filters-row { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
    .search-wrap {
      flex: 1; min-width: 280px; display: flex; align-items: center;
      background: #f5f6fa; border-radius: 10px; padding: 0 16px;
      border: 2px solid transparent; transition: all 0.2s ease;
    }
    .search-wrap:focus-within { border-color: #e94560; background: #fff; }
    .search-icon { color: #aaa; font-size: 20px; width: 20px; height: 20px; margin-right: 10px; }
    .search-input {
      border: none; outline: none; background: none; flex: 1;
      padding: 14px 0; font-size: 0.95rem; color: #333;
    }
    .search-input::placeholder { color: #bbb; }
    .select-custom {
      display: flex; align-items: center; gap: 10px;
      background: #f5f6fa; border-radius: 10px; padding: 0 16px;
      border: 2px solid transparent; transition: all 0.2s ease;
      min-width: 220px; height: 48px; cursor: pointer;
    }
    .select-custom:hover { border-color: #ddd; }
    .select-custom:focus-within { border-color: #e94560; background: #fff; }
    .sel-icon { color: #aaa; font-size: 20px; width: 20px; height: 20px; flex-shrink: 0; }
    :host ::ng-deep .select-custom .mat-mdc-select { flex: 1; }
    :host ::ng-deep .select-custom .mat-mdc-select-trigger { height: 100%; }
    :host ::ng-deep .select-custom .mat-mdc-select-value { font-size: 0.95rem; color: #333; }
    :host ::ng-deep .select-custom .mat-mdc-select-placeholder { color: #bbb; font-size: 0.95rem; }
    :host ::ng-deep .select-custom .mat-mdc-select-arrow-wrapper { color: #bbb; }
    .btn-clear {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 28px; border-radius: 10px;
      background: none; color: #888; border: 1px solid #ddd;
      font-size: 0.88rem; font-weight: 500; cursor: pointer;
      transition: all 0.2s ease; white-space: nowrap;
    }
    .btn-clear:hover { background: #f5f5f5; color: #555; }
    .btn-clear mat-icon { font-size: 18px; width: 18px; height: 18px; }

    .loading-bar { margin-bottom: 20px; border-radius: 8px; }

    .table-container {
      background: #fff; border-radius: 16px; overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }
    .product-table { width: 100%; }

    :host ::ng-deep .mat-mdc-header-row {
      background: linear-gradient(135deg, #1a1a2e, #16213e) !important;
    }
    :host ::ng-deep .mat-mdc-header-cell {
      color: rgba(255,255,255,0.9) !important; font-weight: 600 !important;
      font-size: 0.8rem !important; text-transform: uppercase !important;
      letter-spacing: 0.5px !important; border-bottom: none !important;
    }
    :host ::ng-deep .mat-sort-header-arrow { color: #e94560 !important; opacity: 1 !important; }
    :host ::ng-deep .mat-sort-header-container { cursor: pointer; }
    :host ::ng-deep .mat-sort-header:not([aria-sort="none"]) .mat-sort-header-arrow { opacity: 1 !important; }
    :host ::ng-deep .mat-sort-header[aria-sort="none"] .mat-sort-header-arrow { opacity: 0 !important; }
    :host ::ng-deep .mat-sort-header[aria-sort="none"]:hover .mat-sort-header-arrow { opacity: 0.4 !important; }
    :host ::ng-deep .mat-mdc-row { border-bottom: 1px solid #f0f0f0 !important; }
    :host ::ng-deep .mat-mdc-cell { padding: 14px 16px !important; color: #444 !important; font-size: 0.9rem !important; }

    .id-badge {
      display: inline-flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; border-radius: 8px;
      background: #f0f2f5; color: #666; font-weight: 700; font-size: 0.85rem;
    }
    .name-cell { font-weight: 600 !important; color: #1a1a2e !important; }
    .price { font-weight: 700 !important; color: #0f3460 !important; font-size: 0.95rem !important; }
    code {
      background: #f0f2f5; padding: 4px 10px; border-radius: 6px;
      font-size: 0.8rem; color: #666; font-family: 'Consolas', monospace;
    }
    .cat-tag {
      background: #e8eaf6; color: #3949ab; padding: 4px 12px;
      border-radius: 8px; font-size: 0.8rem; font-weight: 600;
    }
    .badge-success {
      background: #e8f5e9; color: #2e7d32; padding: 5px 12px;
      border-radius: 20px; font-size: 0.8rem; font-weight: 600;
    }
    .badge-danger {
      background: #fce4ec; color: #c62828; padding: 5px 12px;
      border-radius: 20px; font-size: 0.8rem; font-weight: 600;
    }
    .status-active, .status-inactive {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 0.8rem; font-weight: 600;
    }
    .status-active { color: #2e7d32; }
    .status-inactive { color: #999; }
    .status-active .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #4caf50; display: inline-block; }
    .status-inactive .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #ccc; display: inline-block; }

    .actions-cell { white-space: nowrap; }
    .action-btn {
      width: 36px; height: 36px; border-radius: 10px; border: none;
      cursor: pointer; display: inline-flex; align-items: center;
      justify-content: center; margin-right: 4px; transition: all 0.2s ease;
      background: transparent;
    }
    .action-btn mat-icon { font-size: 19px; width: 19px; height: 19px; }
    .action-btn.view { color: #5c6bc0; }
    .action-btn.view:hover { background: #e8eaf6; }
    .action-btn.edit { color: #f57c00; }
    .action-btn.edit:hover { background: #fff3e0; }
    .action-btn.delete { color: #e53935; }
    .action-btn.delete:hover { background: #ffebee; }

    .table-row { transition: background 0.15s ease; }
    .table-row:hover { background: #f8f9ff !important; }

    .empty-state { text-align: center; padding: 60px 16px; color: #999; }
    .empty-state mat-icon { font-size: 56px; width: 56px; height: 56px; opacity: 0.3; color: #ccc; }
    .empty-state p { margin: 12px 0 4px; font-size: 1.1rem; font-weight: 600; color: #666; }
    .empty-state span { font-size: 0.85rem; color: #aaa; }

    :host ::ng-deep .mat-mdc-paginator { border-top: 1px solid #f0f0f0; }
  `]
})
export class ProductListComponent implements OnInit {
  search = '';
  selectedCategory: number | null = null;
  displayedColumns = ['id', 'name', 'sku', 'price', 'stock', 'category', 'status', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);
  sortBy = 'id';
  sortDirection = 'asc';

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public productService: ProductService,
    public categoryService: CategoryService,
    public authService: AuthService,
    public router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.categoryService.loadCategories().subscribe();
    this.loadProducts();
  }

  loadProducts() {
    this.productService.loadProducts(this.search || undefined, this.selectedCategory || undefined, 1, this.productService.pageSize(), this.sortBy, this.sortDirection).subscribe({
      next: () => {
        this.dataSource.data = this.productService.products();
      }
    });
  }

  clearFilters() {
    this.search = '';
    this.selectedCategory = null;
    this.productService.loadProducts(undefined, undefined, 1, 5, this.sortBy, this.sortDirection).subscribe({
      next: () => {
        this.dataSource.data = this.productService.products();
      }
    });
  }

  private searchTimeout: any;

  onSearchInput() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.loadProducts(), 400);
  }

  onSortChange(sortState: Sort) {
    this.sortBy = sortState.active || 'id';
    this.sortDirection = sortState.direction || 'asc';
    this.productService.loadProducts(this.search || undefined, this.selectedCategory || undefined, 1, this.productService.pageSize(), this.sortBy, this.sortDirection).subscribe({
      next: () => {
        this.dataSource.data = this.productService.products();
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.productService.loadProducts(this.search || undefined, this.selectedCategory || undefined, event.pageIndex + 1, event.pageSize, this.sortBy, this.sortDirection).subscribe({
      next: () => {
        this.dataSource.data = this.productService.products();
      }
    });
  }

  deleteProduct(id: number, name: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      panelClass: 'confirm-dialog-panel',
      data: {
        title: 'Eliminar producto',
        message: `¿Estas seguro de eliminar "${name}"? Esta accion no se puede deshacer.`,
        confirmText: 'Si, eliminar',
        cancelText: 'Cancelar'
      }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.productService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Producto eliminado correctamente', 'OK', { duration: 3000 });
          this.loadProducts();
        },
        error: (err) => this.snackBar.open(err.error?.message || 'Error al eliminar', 'Cerrar', { duration: 5000 })
      });
    });
  }
}
