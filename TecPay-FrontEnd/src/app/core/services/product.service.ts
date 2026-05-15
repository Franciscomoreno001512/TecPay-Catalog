import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse, CreateProduct, PagedResult, Product, UpdateProduct } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly url = `${environment.apiUrl}/products`;

  products = signal<Product[]>([]);
  totalCount = signal(0);
  currentPage = signal(1);
  pageSize = signal(5);
  loading = signal(false);

  constructor(private http: HttpClient) {}

  loadProducts(search?: string, categoryId?: number, page = 1, pageSize = 5, sortBy?: string, sortDirection?: string): Observable<ApiResponse<PagedResult<Product>>> {
    this.loading.set(true);
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    if (categoryId) params = params.set('categoryId', categoryId);
    if (sortBy) params = params.set('sortBy', sortBy);
    if (sortDirection) params = params.set('sortDirection', sortDirection);

    return this.http.get<ApiResponse<PagedResult<Product>>>(this.url, { params }).pipe(
      tap(res => {
        this.products.set(res.data.items);
        this.totalCount.set(res.data.totalCount);
        this.currentPage.set(res.data.page);
        this.pageSize.set(res.data.pageSize);
        this.loading.set(false);
      })
    );
  }

  getById(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.url}/${id}`);
  }

  create(product: CreateProduct): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.url, product);
  }

  update(id: number, product: UpdateProduct): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.url}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
