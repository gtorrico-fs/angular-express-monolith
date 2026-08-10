import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-architecture',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './architecture.html',
  styleUrl: './architecture.scss',
})
export class Architecture {
  private http = inject(HttpClient);

  apiResponse = signal<string>('// Haz clic en cualquier endpoint para probar la API en vivo');
  selectedEndpoint = signal<string>('');
  apiLatency = signal<number | null>(null);

  testEndpoint(method: string, url: string, payload?: Record<string, unknown>): void {
    const start = performance.now();
    this.selectedEndpoint.set(`${method} ${url}`);
    this.apiResponse.set('Ejecutando petición a la API Monolítica...');

    let req$;
    if (method === 'GET') {
      req$ = this.http.get(url);
    } else if (method === 'POST') {
      req$ = this.http.post(url, payload || {
        title: 'Tarea Creada Desde API Tester',
        category: 'API',
        priority: 'Alta',
        assignedTo: 'Tester Monolito',
        status: 'Pendiente'
      });
    } else {
      req$ = this.http.get(url);
    }

    req$.subscribe({
      next: (data) => {
        const elapsed = Math.round(performance.now() - start);
        this.apiLatency.set(elapsed);
        this.apiResponse.set(JSON.stringify(data, null, 2));
      },
      error: (err) => {
        const elapsed = Math.round(performance.now() - start);
        this.apiLatency.set(elapsed);
        this.apiResponse.set(JSON.stringify({ error: err.message, status: err.status }, null, 2));
      }
    });
  }
}
