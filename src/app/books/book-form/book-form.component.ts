import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  isEditMode = false;
  bookId: string | null = null;
  submitted = false;

  constructor(private fb: FormBuilder, private booksService: BooksService, private router: Router, private route: ActivatedRoute) {

    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      author: ['', [Validators.required, Validators.maxLength(50)]],
      publisherYear: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      genre: ['', [Validators.required, Validators.maxLength(30)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.bookId = id;
        this.booksService.getBookById(this.bookId).subscribe({
          next: (book) => {
            this.bookForm.patchValue(book);
            console.log(book)
          }
        });
      }
    });
  }

  get f() {
    return this.bookForm.controls;
  }

  onSubmit(): void {

    this.submitted = true;
    if (this.bookForm.valid) {
      const book: Book = this.bookForm.value;
      book.id = this.bookId!
      if (this.isEditMode) {

        this.booksService.updateBook(this.bookId!, book).subscribe({
          next: (book) => {
            alert('Libro guardado');
            this.router.navigate(['/books']);
          },
          error: (err) => {
            console.error('Error al iniciar sesión:', err);
            alert('Error al guardar el libro');
          }
        });
      }else {
        this.booksService.addBook(book).subscribe({
          next: () => {
              alert('Libro agregado con éxito');
              this.router.navigate(['/books']);
          },
          error: (err) => {
              console.error('Error al agregar el libro:', err);
              alert('Error al guardar el libro');
          }
        });
      }
    }
  }

  back(): void {
    this.router.navigate(['/books']);
  }
}
