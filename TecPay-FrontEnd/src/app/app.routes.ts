import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'products',
        loadComponent: () => import('./features/products/components/product-list/product-list.component').then(m => m.ProductListComponent)
      },
      {
        path: 'products/new',
        loadComponent: () => import('./features/products/components/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: 'products/:id',
        loadComponent: () => import('./features/products/components/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
      },
      {
        path: 'products/:id/edit',
        loadComponent: () => import('./features/products/components/product-form/product-form.component').then(m => m.ProductFormComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
