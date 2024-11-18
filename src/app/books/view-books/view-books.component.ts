import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Book } from './../../models/book.model';
import { BooksService } from './../../services/books.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-books',
  templateUrl: './view-books.component.html',
  styleUrls: ['./view-books.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ViewBooksComponent implements OnInit {
  books: Book[] = [];

  constructor(private booksService: BooksService, private router: Router) {}

  ngOnInit(): void {
    this.booksService.getBooks().subscribe({
      next: (data) => {
          this.books = data;
      },
    });
  }

  editBook(bookId: string): void {
    this.router.navigate(['/books/edit', bookId]);
  }

  deleteBook(id: string): void {
    this.booksService.deleteBook(id).subscribe({
      next: () => {
        this.books = this.books.filter((book) => book.id !== id);
      },
    });
  }

}

