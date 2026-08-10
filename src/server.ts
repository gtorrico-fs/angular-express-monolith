import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { Request, Response, NextFunction } from 'express';
import { join } from 'node:path';
import fs from 'node:fs';

interface TaskItem {
  id: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  assignedTo: string;
  updatedAt: string;
}

interface ProductItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: string;
}

interface DatabaseStructure {
  tasks: TaskItem[];
  products: ProductItem[];
  system: Record<string, unknown>;
}

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

// Path to db.json storage for JSON Server REST simulation
const dbPath = join(process.cwd(), 'db.json');

// Helper functions for JSON database operations
function readDb(): DatabaseStructure {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8');
      return JSON.parse(data) as DatabaseStructure;
    }
  } catch (err) {
    console.error('Error reading db.json:', err);
  }
  return { tasks: [], products: [], system: {} };
}

function writeDb(data: DatabaseStructure): void {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}

// Global server metrics
let requestCount = 0;
const startTime = Date.now();

// Request logging middleware for Monolith API
app.use('/api', (req: Request, res: Response, next: NextFunction) => {
  requestCount++;
  console.log(`[MONOLITH API] ${req.method} ${req.url}`);
  next();
});

// System Status Endpoint
app.get('/api/system', (_req: Request, res: Response): void => {
  const db = readDb();
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const systemInfo = {
    ...db.system,
    uptimeSeconds,
    totalApiCalls: requestCount,
    status: 'ONLINE',
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
  };
  res.json(systemInfo);
});

// CRUD: Tasks Endpoint
app.get('/api/tasks', (_req: Request, res: Response): void => {
  const db = readDb();
  res.json(db.tasks || []);
});

app.get('/api/tasks/:id', (req: Request, res: Response): void => {
  const db = readDb();
  const task = (db.tasks || []).find((t) => String(t.id) === req.params['id']);
  if (!task) {
    res.status(404).json({ error: 'Tarea no encontrada' });
    return;
  }
  res.json(task);
});

app.post('/api/tasks', (req: Request, res: Response): void => {
  const db = readDb();
  const reqBody = req.body as Partial<TaskItem>;
  const newTask: TaskItem = {
    id: Date.now().toString(),
    title: reqBody.title || 'Nueva Tarea Monolítica',
    category: reqBody.category || 'General',
    status: reqBody.status || 'Pendiente',
    priority: reqBody.priority || 'Media',
    assignedTo: reqBody.assignedTo || 'Desarrollador',
    updatedAt: new Date().toISOString(),
  };
  db.tasks = db.tasks || [];
  db.tasks.unshift(newTask);
  writeDb(db);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req: Request, res: Response): void => {
  const db = readDb();
  const index = (db.tasks || []).findIndex((t) => String(t.id) === req.params['id']);
  if (index === -1) {
    res.status(404).json({ error: 'Tarea no encontrada' });
    return;
  }
  const reqBody = req.body as Partial<TaskItem>;
  db.tasks[index] = {
    ...db.tasks[index],
    ...reqBody,
    updatedAt: new Date().toISOString(),
  };
  writeDb(db);
  res.json(db.tasks[index]);
});

app.delete('/api/tasks/:id', (req: Request, res: Response): void => {
  const db = readDb();
  const initialLength = (db.tasks || []).length;
  db.tasks = (db.tasks || []).filter((t) => String(t.id) !== req.params['id']);
  if (db.tasks.length === initialLength) {
    res.status(404).json({ error: 'Tarea no encontrada' });
    return;
  }
  writeDb(db);
  res.json({ message: 'Tarea eliminada exitosamente', id: req.params['id'] });
});

// CRUD: Products Endpoint
app.get('/api/products', (_req: Request, res: Response): void => {
  const db = readDb();
  res.json(db.products || []);
});

app.post('/api/products', (req: Request, res: Response): void => {
  const db = readDb();
  const reqBody = req.body as Partial<ProductItem>;
  const newProduct: ProductItem = {
    id: Date.now().toString(),
    name: reqBody.name || 'Nuevo Componente',
    category: reqBody.category || 'General',
    stock: Number(reqBody.stock) || 1,
    price: Number(reqBody.price) || 0,
    status: reqBody.status || 'Disponible',
  };
  db.products = db.products || [];
  db.products.unshift(newProduct);
  writeDb(db);
  res.status(201).json(newProduct);
});

app.delete('/api/products/:id', (req: Request, res: Response): void => {
  const db = readDb();
  db.products = (db.products || []).filter((p) => String(p.id) !== req.params['id']);
  writeDb(db);
  res.json({ message: 'Producto eliminado exitosamente', id: req.params['id'] });
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other non-API requests by rendering the Angular application.
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Servidor Monolítico Express + Angular SSR corriendo en http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI
 */
export const reqHandler = createNodeRequestHandler(app);
