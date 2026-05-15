import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProductService } from '../../../../core/services/product.service';
import { CategoryService } from '../../../../core/services/category.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule, MatSlideToggleModule],
  template: `
    <div class="page-header">
      <div>
        <h1>
          <button class="back-btn" (click)="router.navigate(['/products'])">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <mat-icon class="title-icon">{{ isEdit ? 'edit_note' : 'add_box' }}</mat-icon>
          {{ isEdit ? 'Editar Producto' : 'Nuevo Producto' }}
        </h1>
        <p class="subtitle">{{ isEdit ? 'Modifica los datos del producto' : 'Completa los campos para registrar un nuevo producto' }}</p>
      </div>
    </div>

    <div class="form-container">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-section">
          <div class="section-header">
            <mat-icon>info</mat-icon>
            <span>Informacion General</span>
          </div>
          <div class="section-body">
            <div class="field-row">
              <div class="field-group">
                <label>Nombre del producto *</label>
                <div class="input-wrap" [class.error]="form.get('name')?.touched && form.get('name')?.invalid">
                  <mat-icon>label</mat-icon>
                  <input formControlName="name" placeholder="Ej: Laptop HP Pavilion 15">
                </div>
                @if (form.get('name')?.touched && form.get('name')?.hasError('required')) {
                  <span class="field-error">Campo requerido</span>
                }
              </div>
              <div class="field-group">
                <label>SKU *</label>
                <div class="input-wrap" [class.error]="form.get('sku')?.touched && form.get('sku')?.invalid">
                  <mat-icon>qr_code</mat-icon>
                  <input formControlName="sku" placeholder="Ej: ELEC-001">
                </div>
                @if (form.get('sku')?.touched && form.get('sku')?.hasError('required')) {
                  <span class="field-error">Campo requerido</span>
                }
              </div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-header">
            <mat-icon>attach_money</mat-icon>
            <span>Precio e Inventario</span>
          </div>
          <div class="section-body">
            <div class="field-row">
              <div class="field-group">
                <label>Precio *</label>
                <div class="input-wrap" [class.error]="form.get('price')?.touched && form.get('price')?.invalid">
                  <span class="prefix">$</span>
                  <input type="number" formControlName="price" placeholder="0.00" step="0.01">
                </div>
                @if (form.get('price')?.touched && form.get('price')?.hasError('required')) {
                  <span class="field-error">Campo requerido</span>
                }
                @if (form.get('price')?.hasError('min')) {
                  <span class="field-error">Debe ser mayor a 0</span>
                }
              </div>
              <div class="field-group">
                <label>Stock</label>
                <div class="input-wrap">
                  <mat-icon>inventory</mat-icon>
                  <input type="number" formControlName="stock" placeholder="0">
                </div>
                @if (form.get('stock')?.hasError('min')) {
                  <span class="field-error">No puede ser negativo</span>
                }
              </div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-header">
            <mat-icon>category</mat-icon>
            <span>Clasificacion</span>
          </div>
          <div class="section-body">
            <div class="field-row">
              <div class="field-group">
                <label>Categoria *</label>
                <div class="input-wrap select-input" [class.error]="form.get('categoryId')?.touched && form.get('categoryId')?.invalid">
                  <mat-icon>category</mat-icon>
                  <mat-select formControlName="categoryId" placeholder="Selecciona una categoria" panelClass="custom-select-panel">
                    @for (cat of categoryService.categories(); track cat.id) {
                      <mat-option [value]="cat.id">{{ cat.name }}</mat-option>
                    }
                  </mat-select>
                </div>
                @if (form.get('categoryId')?.touched && form.get('categoryId')?.hasError('required')) {
                  <span class="field-error">Seleccione una categoria</span>
                }
              </div>
              @if (isEdit) {
                <div class="field-group">
                  <label>Estado</label>
                  <div class="toggle-wrap">
                    <mat-slide-toggle formControlName="isActive" color="primary">
                      {{ form.get('isActive')?.value ? 'Activo' : 'Inactivo' }}
                    </mat-slide-toggle>
                  </div>
                </div>
              }
            </div>
            <div class="field-row">
              <div class="field-group full">
                <label>Descripcion</label>
                <div class="input-wrap textarea-wrap">
                  <mat-icon>description</mat-icon>
                  <textarea formControlName="description" rows="4" placeholder="Descripcion opcional del producto..."></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        @if (errorMessage) {
          <div class="error-banner">
            <mat-icon>error_outline</mat-icon>
            {{ errorMessage }}
          </div>
        }

        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="router.navigate(['/products'])">
            <mat-icon>close</mat-icon> Cancelar
          </button>
          <button type="submit" class="btn-submit" [disabled]="form.invalid || saving">
            @if (saving) { <mat-spinner diameter="20" class="spinner"></mat-spinner> }
            <mat-icon>{{ isEdit ? 'save' : 'add_circle' }}</mat-icon>
            {{ saving ? 'Guardando...' : (isEdit ? 'Actualizar Producto' : 'Crear Producto') }}
          </button>
        </div>
      </form>
    </div>
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

    .form-container { max-width: 820px; margin: 0 auto; }

    .form-section {
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

    .field-row { display: flex; gap: 24px; margin-bottom: 8px; }
    .field-group { flex: 1; margin-bottom: 12px; }
    .field-group.full { flex: 1 1 100%; }
    .field-group label {
      display: block; font-size: 0.8rem; font-weight: 700; color: #555;
      margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .input-wrap {
      display: flex; align-items: center; gap: 12px;
      background: #f8f9fc; border: 2px solid #e8e8e8; border-radius: 12px;
      padding: 0 16px; transition: all 0.25s ease;
    }
    .input-wrap:focus-within { border-color: #e94560; background: #fff; box-shadow: 0 0 0 4px rgba(233,69,96,0.08); }
    .input-wrap.error { border-color: #e53935; }
    .input-wrap mat-icon { color: #bbb; font-size: 20px; width: 20px; height: 20px; flex-shrink: 0; }
    .input-wrap .prefix { color: #888; font-weight: 700; font-size: 1rem; flex-shrink: 0; }
    .input-wrap input {
      flex: 1; border: none; outline: none; padding: 14px 0;
      font-size: 0.95rem; color: #333; background: none; min-width: 0;
    }
    .input-wrap input::placeholder { color: #ccc; }
    .textarea-wrap { align-items: flex-start; padding-top: 14px; }
    .textarea-wrap mat-icon { margin-top: 2px; }
    .textarea-wrap textarea {
      flex: 1; border: none; outline: none; padding: 0;
      font-size: 0.95rem; color: #333; background: none; resize: vertical;
      font-family: inherit; min-width: 0;
    }
    .textarea-wrap textarea::placeholder { color: #ccc; }
    .field-error { display: block; color: #e53935; font-size: 0.75rem; margin-top: 6px; font-weight: 600; }

    .select-input { cursor: pointer; padding: 4px 16px; }
    :host ::ng-deep .select-input .mat-mdc-select { flex: 1; }
    :host ::ng-deep .select-input .mat-mdc-select-trigger { padding: 10px 0; }
    :host ::ng-deep .select-input .mat-mdc-select-value { font-size: 0.95rem; color: #333; }
    :host ::ng-deep .select-input .mat-mdc-select-placeholder { color: #ccc; font-size: 0.95rem; }
    :host ::ng-deep .select-input .mat-mdc-select-arrow-wrapper { color: #bbb; }

    .toggle-wrap {
      padding: 16px 0; display: flex; align-items: center;
    }

    .error-banner {
      display: flex; align-items: center; gap: 10px;
      background: linear-gradient(135deg, #fff5f5, #ffe0e0); color: #c62828;
      padding: 14px 20px; border-radius: 12px; margin-bottom: 20px;
      border-left: 4px solid #e53935;
    }

    .form-actions {
      display: flex; gap: 16px; justify-content: flex-end; margin-top: 8px;
    }
    .btn-cancel {
      display: flex; align-items: center; gap: 8px;
      padding: 14px 28px; border-radius: 12px;
      background: #fff; color: #666; border: 1px solid #ddd;
      font-size: 0.9rem; font-weight: 600; cursor: pointer;
      transition: all 0.2s;
    }
    .btn-cancel:hover { background: #f5f5f5; color: #333; }
    .btn-cancel mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .btn-submit {
      display: flex; align-items: center; gap: 8px;
      padding: 14px 32px; border-radius: 12px; border: none;
      background: linear-gradient(135deg, #e94560, #c23152);
      color: #fff; font-size: 0.9rem; font-weight: 700;
      cursor: pointer; transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(233,69,96,0.35);
    }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(233,69,96,0.45); }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-submit mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .spinner { display: inline-block; }
    :host ::ng-deep .spinner .mdc-circular-progress__indeterminate-circle-graphic { stroke: #fff !important; }
  `]
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  productId: number | null = null;
  saving = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private productService: ProductService,
    public categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.categoryService.loadCategories().subscribe();
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: [''],
      price: [null, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      sku: ['', [Validators.required, Validators.maxLength(50)]],
      categoryId: [null, Validators.required],
      isActive: [true]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.productId = +id;
      this.productService.getById(this.productId).subscribe({
        next: (res) => this.form.patchValue(res.data),
        error: () => this.router.navigate(['/products'])
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving = true;
    this.errorMessage = '';

    const obs = this.isEdit && this.productId
      ? this.productService.update(this.productId, this.form.value)
      : this.productService.create(this.form.value);

    obs.subscribe({
      next: () => {
        this.snackBar.open(this.isEdit ? 'Producto actualizado' : 'Producto creado', 'OK', { duration: 3000 });
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.message || 'Error al guardar';
      }
    });
  }
}
