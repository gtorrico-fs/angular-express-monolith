export interface Task {
  id: string;
  title: string;
  category: string;
  status: 'Completado' | 'En Proceso' | 'Pendiente';
  priority: 'Alta' | 'Media' | 'Baja';
  assignedTo: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: string;
}

export interface SystemStatus {
  name: string;
  architecture: string;
  frontendFramework: string;
  apiProvider: string;
  stylePreprocessor: string;
  status: string;
  serverPort: number;
  uptimeSeconds: number;
  totalApiCalls: number;
  memoryUsageMB?: number;
}
