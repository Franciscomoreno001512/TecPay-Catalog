import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { ApiResponse, Category } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  categories = signal<Category[]>([]);

  constructor(private http: HttpClient) {}

  loadCategories() {
    return this.http.get<ApiResponse<Category[]>>(`${environment.apiUrl}/categories`).pipe(
      tap(res => this.categories.set(res.data))
    );
  }
}
