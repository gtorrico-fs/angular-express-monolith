import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Task, Product, SystemStatus } from '../models/monolith.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  // Reactive state signals
  readonly systemInfo = signal<SystemStatus | null>(null);
  readonly tasks = signal<Task[]>([]);
  readonly products = signal<Product[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // Load all initial data from Monolith API
  loadInitialData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.fetchSystemInfo().subscribe();
    this.fetchTasks().subscribe();
    this.fetchProducts().subscribe(() => this.loading.set(false));
  }

  fetchSystemInfo(): Observable<SystemStatus | null> {
    return this.http.get<SystemStatus>('/api/system').pipe(
      tap(sys => this.systemInfo.set(sys)),
      catchError(err => {
        console.error('Error fetching system info', err);
        this.error.set('No se pudo conectar con la API Monolítica');
        return of(null);
      })
    );
  }

  fetchTasks(): Observable<Task[]> {
    return this.http.get<Task[]>('/api/tasks').pipe(
      tap(tasksList => this.tasks.set(tasksList)),
      catchError(err => {
        console.error('Error fetching tasks', err);
        return of([]);
      })
    );
  }

  addTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>('/api/tasks', task).pipe(
      tap(newTask => {
        this.tasks.update(curr => [newTask, ...curr]);
        this.fetchSystemInfo().subscribe();
      })
    );
  }

  updateTaskStatus(id: string, status: Task['status']): Observable<Task> {
    return this.http.put<Task>(`/api/tasks/${id}`, { status }).pipe(
      tap(updated => {
        this.tasks.update(curr => curr.map(t => t.id === id ? updated : t));
        this.fetchSystemInfo().subscribe();
      })
    );
  }

  deleteTask(id: string): Observable<{ message: string; id: string }> {
    return this.http.delete<{ message: string; id: string }>(`/api/tasks/${id}`).pipe(
      tap(() => {
        this.tasks.update(curr => curr.filter(t => t.id !== id));
        this.fetchSystemInfo().subscribe();
      })
    );
  }

  fetchProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products').pipe(
      tap(prods => this.products.set(prods)),
      catchError(err => {
        console.error('Error fetching products', err);
        return of([]);
      })
    );
  }

  addProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>('/api/products', product).pipe(
      tap(newProd => {
        this.products.update(curr => [newProd, ...curr]);
        this.fetchSystemInfo().subscribe();
      })
    );
  }

  deleteProduct(id: string): Observable<{ message: string; id: string }> {
    return this.http.delete<{ message: string; id: string }>(`/api/products/${id}`).pipe(
      tap(() => {
        this.products.update(curr => curr.filter(p => p.id !== id));
        this.fetchSystemInfo().subscribe();
      })
    );
  }
}
