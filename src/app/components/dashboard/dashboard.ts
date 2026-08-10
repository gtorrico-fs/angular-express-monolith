import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SystemStatus, Task, Product } from '../../models/monolith.model';

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  systemInfo = input<SystemStatus | null>(null);
  tasks = input<Task[]>([]);
  products = input<Product[]>([]);
  navigateTab = output<string>();

  onNavigate(tab: string): void {
    this.navigateTab.emit(tab);
  }

  get completedTasksCount(): number {
    return this.tasks().filter(t => t.status === 'Completado').length;
  }

  get pendingTasksCount(): number {
    return this.tasks().filter(t => t.status === 'Pendiente' || t.status === 'En Proceso').length;
  }
}
