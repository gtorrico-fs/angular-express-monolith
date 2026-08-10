import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface DesignPattern {
  id: string;
  name: string;
  type: 'creational' | 'structural' | 'behavioral';
  typeName: string;
  icon: string;
  summary: string;
  angularConcept: string;
  fileLocation: string;
  codeSnippet: string;
  explanation: string;
}

@Component({
  selector: 'app-design-patterns',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './design-patterns.html',
  styleUrl: './design-patterns.scss',
})
export class DesignPatterns {
  selectedCategory = signal<'all' | 'creational' | 'structural' | 'behavioral'>('all');
  expandedPatternId = signal<string | null>('singleton');

  patterns: DesignPattern[] = [
    // --- PATRONES CREACIONALES ---
    {
      id: 'singleton',
      name: 'Singleton Pattern',
      type: 'creational',
      typeName: 'Creacional',
      icon: 'filter_1',
      summary: 'Garantiza una única instancia global compartida durante todo el ciclo de vida de la aplicación.',
      angularConcept: 'Inyección de Dependencias con `@Injectable({ providedIn: "root" })`.',
      fileLocation: 'src/app/services/api.service.ts',
      codeSnippet: `@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private tasksSignal = signal<Task[]>([]);
  readonly tasks = this.tasksSignal.asReadonly();
  // ...instancia única global compartida
}`,
      explanation: 'Al declarar `providedIn: "root"`, el inyector raíz de Angular crea una única instancia de `ApiService`. Todos los componentes (App, Dashboard, Tasks, Products) reciben exactamente la misma instancia en memoria, garantizando un estado reactivo global consistente.',
    },
    {
      id: 'factory',
      name: 'Factory Method / Dependency Injection',
      type: 'creational',
      typeName: 'Creacional',
      icon: 'precision_manufacturing',
      summary: 'Delega la creación de objetos e instancias a un contenedor inyector sin acoplar clases concretas.',
      angularConcept: 'Contenedor de DI de Angular y la función `inject()`.',
      fileLocation: 'src/app/components/products/products.ts',
      codeSnippet: `@Component({ ... })
export class Products {
  // Inyección de fábrica administrada por el runtime de Angular
  private fb = inject(FormBuilder);
  apiService = inject(ApiService);
}`,
      explanation: 'En lugar de que el componente instancie dependencias con `new FormBuilder()`, le solicita al contenedor DI de Angular que las resuelva y fabrique mediante `inject()`, permitiendo bajo acoplamiento y fácil sustitución en tests.',
    },
    {
      id: 'builder',
      name: 'Builder Pattern',
      type: 'creational',
      typeName: 'Creacional',
      icon: 'construction',
      summary: 'Permite construir objetos o configuraciones complejas paso a paso con una API fluida.',
      angularConcept: 'FormBuilder en Reactive Forms (`fb.group({ ... })`).',
      fileLocation: 'src/app/components/tasks/tasks.ts',
      codeSnippet: `this.taskForm = this.fb.group({
  title: ['', [Validators.required, Validators.minLength(3)]],
  category: ['Frontend Core', Validators.required],
  priority: ['Media', Validators.required],
  assignedTo: ['Desarrollador', Validators.required],
});`,
      explanation: '`FormBuilder` actúa como un Builder que simplifica la construcción paso a paso de árboles complejos de objetos `FormGroup` y `FormControl` junto con sus reglas de validación sin instanciaciones manuales repetitivas.',
    },

    // --- PATRONES ESTRUCTURALES ---
    {
      id: 'decorator',
      name: 'Decorator Pattern',
      type: 'structural',
      typeName: 'Estructural',
      icon: 'auto_awesome',
      summary: 'Añade metadatos y comportamientos dinámicos a clases o métodos sin modificar su código interno.',
      angularConcept: 'Decoradores TypeScript (`@Component`, `@Injectable`, `@Directive`).',
      fileLocation: 'src/app/components/dashboard/dashboard.ts',
      codeSnippet: `@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard { ... }`,
      explanation: 'El decorador `@Component` envuelve una clase nativa de TypeScript y la extiende con capacidades de compilación de Angular: enlace de plantilla HTML, scoped SCSS, detección de cambios OnPush y ciclo de vida.',
    },
    {
      id: 'composite',
      name: 'Composite Pattern',
      type: 'structural',
      typeName: 'Estructural',
      icon: 'account_tree',
      summary: 'Organiza componentes en estructuras jerárquicas de árbol donde contenedores y hojas se tratan de forma uniforme.',
      angularConcept: 'Jerarquía de Árbol de Componentes Angular.',
      fileLocation: 'src/app/app.html',
      codeSnippet: `<div class="app-layout">
  <app-header [systemInfo]="apiService.systemInfo()" />
  <main class="main-content">
    <app-dashboard /> <!-- Hojas o sub-árboles de componentes -->
  </main>
</div>`,
      explanation: 'El componente raíz `App` compone sub-componentes (`Header`, `Dashboard`, `Tasks`, `Products`, `Architecture`) formando un árbol. Cada nodo gestiona su propio sub-árbol de renderizado de manera uniforme.',
    },
    {
      id: 'adapter',
      name: 'Adapter / Proxy Pattern',
      type: 'structural',
      typeName: 'Estructural',
      icon: 'hub',
      summary: 'Convierte interfaces e intermediarios para adaptar llamadas de API o servicios externos al modelo de dominio del cliente.',
      angularConcept: 'Capa de Servicio HTTP (`ApiService`) y Express SSR Middleware.',
      fileLocation: 'src/app/services/api.service.ts & src/server.ts',
      codeSnippet: `// ApiService adapta peticiones HTTP REST a Signals de Angular:
getTasks(): Observable<Task[]> {
  return this.http.get<Task[]>(this.tasksUrl).pipe(
    tap((tasks) => this.tasksSignal.set(tasks)),
    catchError(this.handleError)
  );
}`,
      explanation: '`ApiService` actúa como adaptador entre el protocolo HTTP REST / endpoints Express y el estado cliente de la UI. Oculta detalles de red y expone datos limpios encapsulados en Signals reactivas.',
    },

    // --- PATRONES COMPORTAMENTALES ---
    {
      id: 'observer',
      name: 'Observer / Reactive State Pattern',
      type: 'behavioral',
      typeName: 'Comportamental',
      icon: 'visibility',
      summary: 'Establece una relación uno-a-muchos donde los cambios en el estado notifican automáticamente a todos sus suscriptores.',
      angularConcept: 'Angular Signals (`signal()`, `computed()`) y RxJS Observables.',
      fileLocation: 'src/app/services/api.service.ts',
      codeSnippet: `private tasksSignal = signal<Task[]>([]);
readonly tasks = this.tasksSignal.asReadonly();

// En la plantilla HTML (Suscriptor observador):
@for (task of tasks(); track task.id) {
  <div class="task-item">{{ task.title }}</div>
}`,
      explanation: 'Cuando `tasksSignal.set()` modifica la lista de tareas, Angular notifica automáticamente a la plantilla del componente. La UI se re-renderiza eficientemente en respuesta al cambio de estado reactivo.',
    },
    {
      id: 'mediator',
      name: 'Mediator Pattern (Mediador)',
      type: 'behavioral',
      typeName: 'Comportamental',
      icon: 'alt_route',
      summary: 'Encapsula la interacción entre múltiples objetos para evitar el acoplamiento directo entre ellos.',
      angularConcept: 'Componente Contenedor Padre (`App`) coordinando `input()` y `output()`.',
      fileLocation: 'src/app/app.ts',
      codeSnippet: `// App actúa como Mediador entre Header, Tasks, Products y ApiService:
handleCreateTask(task: Partial<Task>): void {
  this.apiService.addTask(task).subscribe();
}`,
      explanation: 'Los componentes hijos como `Tasks` o `Products` no se comunican directamente entre sí ni directamente con la base de datos. Emiten eventos `output()` hacia el mediador `App`, que coordina la actualización del servicio.',
    },
    {
      id: 'strategy',
      name: 'Strategy Pattern (Estrategia)',
      type: 'behavioral',
      typeName: 'Comportamental',
      icon: 'style',
      summary: 'Permite intercambiar algoritmos o componentes de renderizado dinámicamente en tiempo de ejecución.',
      angularConcept: 'Control Flow Condicional (`@switch`, `@if`) y ChangeDetectionStrategy.',
      fileLocation: 'src/app/app.html',
      codeSnippet: `@switch (activeTab()) {
  @case ('dashboard') { <app-dashboard /> }
  @case ('tasks') { <app-tasks /> }
  @case ('products') { <app-products /> }
  @case ('architecture') { <app-architecture /> }
  @case ('patterns') { <app-design-patterns /> }
}`,
      explanation: 'El flujo de control `@switch` evalúa el valor de `activeTab()` y selecciona la estrategia de renderizado adecuada en runtime, cambiando la vista sin alterar el contenedor ni requerir recargas de página.',
    },
  ];

  get filteredPatterns(): DesignPattern[] {
    const category = this.selectedCategory();
    if (category === 'all') return this.patterns;
    return this.patterns.filter((p) => p.type === category);
  }

  setCategory(category: 'all' | 'creational' | 'structural' | 'behavioral'): void {
    this.selectedCategory.set(category);
  }

  toggleExpand(id: string): void {
    if (this.expandedPatternId() === id) {
      this.expandedPatternId.set(null);
    } else {
      this.expandedPatternId.set(id);
    }
  }

  getCategoryCount(type: 'all' | 'creational' | 'structural' | 'behavioral'): number {
    if (type === 'all') return this.patterns.length;
    return this.patterns.filter((p) => p.type === type).length;
  }
}
