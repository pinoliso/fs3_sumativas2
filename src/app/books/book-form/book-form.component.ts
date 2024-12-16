import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'
})
export class BookFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  submitted = false;

  constructor(private fb: FormBuilder, private productsService: ProductsService, private router: Router, private route: ActivatedRoute) {

    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      price: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      stock: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = id;
      this.productsService.getProductById(this.productId).subscribe({
        next: (product) => {
          this.productForm.patchValue(product);
          console.log(product);
        },
        error: (err) => {
          console.error('Error fetching product by ID:', err);
        },
      });
    }
  }

  get f() {
    return this.productForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;
      if (this.isEditMode) {
        this.productsService.updateProduct(this.productId!, product).subscribe({
          next: (product) => {
            alert('Producto guardado');
            this.router.navigate(['/products']);
          },
          error: (err) => {
            console.error('Error al guardar el producto:', err);
            alert('Error al guardar el producto');
          }
        });
      } else {
        this.productsService.addProduct(product).subscribe({
          next: () => {
            alert('Producto agregado con éxito');
            this.router.navigate(['/products']);
          },
          error: (err) => {
            console.error('Error al agregar el producto:', err);
            alert('Error al guardar el producto');
          }
        });
      }
    }
  }

  back(): void {
    this.router.navigate(['/products']);
  }
}

