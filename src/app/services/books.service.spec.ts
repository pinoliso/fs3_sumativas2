import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { Product } from '../models/product.model';
import { Router } from '@angular/router';

describe('BooksService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test Author',
    price: 100,
    stock: 12,
  };

  const apiUrl = 'http://example.com/api/products'; // Replace with your actual API URL for testing

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService,
        { provide: Router, useValue: mockRouter },
      ],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all products', () => {
    const mockProducts: Product[] = [mockProduct];

    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts); // Simulate API response
  });

  it('should retrieve a product by ID', () => {
    service.getProductById(mockProduct.id).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${apiUrl}/${mockProduct.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct); // Simulate API response
  });

  it('should add a new product', () => {
    service.addProduct(mockProduct).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockProduct); // Simulate API response
  });

  it('should update an existing product', () => {
    const updatedProduct = { ...mockProduct, title: 'Updated Title' };

    service.updateProduct(mockProduct.id, updatedProduct).subscribe((product) => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`${apiUrl}/${mockProduct.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedProduct);
    req.flush(updatedProduct); // Simulate API response
  });

  it('should delete a product by ID', () => {
    service.deleteProduct(mockProduct.id).subscribe((response) => {
      expect(response).toBeUndefined(); // DELETE requests often return no body
    });

    const req = httpMock.expectOne(`${apiUrl}/${mockProduct.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Simulate API response
  });
});

