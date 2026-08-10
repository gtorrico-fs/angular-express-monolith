import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../models/monolith.model';

@Component({
  selector: 'app-products',
  imports: [ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  private fb = inject(FormBuilder);

  products = input<Product[]>([]);
  createProduct = output<Partial<Product>>();
  deleteProduct = output<string>();

  showModal = signal<boolean>(false);
  searchTerm = signal<string>('');

  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    category: ['Frontend Core', Validators.required],
    stock: [100, [Validators.required, Validators.min(1)]],
    price: [99.99, [Validators.required, Validators.min(0)]],
  });

  get filteredProducts(): Product[] {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.products();
    return this.products().filter(p =>
      p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)
    );
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  openModal(): void {
    this.productForm.reset({
      name: '',
      category: 'Frontend Core',
      stock: 50,
      price: 120.0,
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    this.createProduct.emit({
      name: this.productForm.value.name as string,
      category: this.productForm.value.category as string,
      stock: Number(this.productForm.value.stock),
      price: Number(this.productForm.value.price),
      status: 'Disponible',
    });

    this.closeModal();
  }

  onDelete(id: string): void {
    if (confirm('¿Eliminar este producto de la API de inventario?')) {
      this.deleteProduct.emit(id);
    }
  }
}
