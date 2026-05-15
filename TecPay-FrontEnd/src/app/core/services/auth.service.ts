import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { ApiResponse, LoginRequest, LoginResponse } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenSignal = signal<string | null>(localStorage.getItem('token'));

  isAuthenticated = computed(() => !!this.tokenSignal());
  token = computed(() => this.tokenSignal());

  constructor(private http: HttpClient) {}

  login(request: LoginRequest) {
    return this.http.post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap(res => {
        localStorage.setItem('token', res.data.token);
        this.tokenSignal.set(res.data.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.tokenSignal.set(null);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }
}
