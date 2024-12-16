import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from './../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-books',
  templateUrl: './view-books.component.html',
  styleUrls: ['./view-books.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ViewBooksComponent implements OnInit {
  products: Product[] = [];

  constructor(private productsService: ProductsService, private router: Router) {}

  ngOnInit(): void {
    this.productsService.getSellProducts().subscribe({
      next: (data) => {
          this.products = data;
      },
    });
  }

  editProduct(productId: string): void {
    this.router.navigate(['/products/edit', productId]);
  }

  deleteProduct(id: string): void {
    this.productsService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter((product) => product.id !== id);
      },
    });
  }

}

