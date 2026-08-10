import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from './services/api.service';
import { Header } from './components/header/header';
import { Dashboard } from './components/dashboard/dashboard';
import { Tasks } from './components/tasks/tasks';
import { Products } from './components/products/products';
import { Architecture } from './components/architecture/architecture';
import { DesignPatterns } from './components/design-patterns/design-patterns';
import { Task, Product } from './models/monolith.model';

@Component({
  selector: 'app-root',
  imports: [Header, Dashboard, Tasks, Products, Architecture, DesignPatterns],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  apiService = inject(ApiService);
  activeTab = signal<string>('dashboard');

  ngOnInit(): void {
    this.apiService.loadInitialData();
  }

  onTabChange(tab: string): void {
    this.activeTab.set(tab);
  }

  handleCreateTask(task: Partial<Task>): void {
    this.apiService.addTask(task).subscribe();
  }

  handleUpdateTaskStatus(event: { id: string; status: Task['status'] }): void {
    this.apiService.updateTaskStatus(event.id, event.status).subscribe();
  }

  handleDeleteTask(id: string): void {
    this.apiService.deleteTask(id).subscribe();
  }

  handleCreateProduct(product: Partial<Product>): void {
    this.apiService.addProduct(product).subscribe();
  }

  handleDeleteProduct(id: string): void {
    this.apiService.deleteProduct(id).subscribe();
  }
}
