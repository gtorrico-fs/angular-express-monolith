import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../models/monolith.model';

@Component({
  selector: 'app-tasks',
  imports: [ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks {
  private fb = inject(FormBuilder);

  tasks = input<Task[]>([]);
  createTask = output<Partial<Task>>();
  updateTaskStatus = output<{ id: string; status: Task['status'] }>();
  deleteTask = output<string>();

  showModal = signal<boolean>(false);
  filterCategory = signal<string>('TODAS');

  taskForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    category: ['Backend', Validators.required],
    priority: ['Media', Validators.required],
    assignedTo: ['', Validators.required],
  });

  get filteredTasks(): Task[] {
    const cat = this.filterCategory();
    if (cat === 'TODAS') return this.tasks();
    return this.tasks().filter(t => t.category === cat);
  }

  openModal(): void {
    this.taskForm.reset({
      title: '',
      category: 'Backend',
      priority: 'Media',
      assignedTo: 'Carlos Dev',
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    this.createTask.emit({
      title: this.taskForm.value.title as string,
      category: this.taskForm.value.category as string,
      priority: this.taskForm.value.priority as Task['priority'],
      assignedTo: this.taskForm.value.assignedTo as string,
      status: 'Pendiente',
    });

    this.closeModal();
  }

  onToggleStatus(task: Task): void {
    let newStatus: Task['status'] = 'Completado';
    if (task.status === 'Completado') newStatus = 'Pendiente';
    else if (task.status === 'Pendiente') newStatus = 'En Proceso';

    this.updateTaskStatus.emit({ id: task.id, status: newStatus });
  }

  onDelete(id: string): void {
    if (confirm('¿Estás seguro de eliminar esta tarea de la API monolítica?')) {
      this.deleteTask.emit(id);
    }
  }

  setCategoryFilter(cat: string): void {
    this.filterCategory.set(cat);
  }
}
