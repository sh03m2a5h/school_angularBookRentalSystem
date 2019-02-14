import { Component, OnInit } from '@angular/core';
import { Book } from '../DataBase';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent implements OnInit {
  books: Book[];
  editingBook: Book = new Book();
  searchText = '';
  registerBook: Book;
  selectedBook: Book;
  registerForm: boolean;

  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
    this.getBooks();
  }

  getBooks(): void {
    this.databaseService.getBooks().subscribe(books => {
      this.books = books;
    });
  }

  showRegister() {
    this.registerForm = !this.registerForm;
    this.registerBook = new Book();
  }

  delete(book: Book) {
    if (confirm('本当に削除しますか？')) {
      this.databaseService.deleteBook(book);
    }
  }

  edit(book: Book) {
    if (this.editingBook.isbn && !confirm('編集中のデータは削除されます。よろしいですか？')) {
      return;
    }
    this.editingBook.isbn = book.isbn;
    this.editingBook.actor = book.actor;
    this.editingBook.title = book.title;
    this.editingBook.date = new Date(book.date);
  }

  editingBookDateChange(date: string) {
    this.editingBook.date = new Date(date);
  }

  save() {
    this.databaseService.bookEditApply(this.editingBook);
    this.editingBook = new Book();
  }

  doRegister() {
    this.registerBook.isbn = Number(this.registerBook.isbn);
    if (!this.databaseService.addBook(this.registerBook)) {
      alert('同じISBNコードの書籍が存在するようです');
      if (!confirm('入力を中止しますか?')) {
        return;
      }
    }
    this.registerBook = new Book();
  }

  registerBookDateChange(date: string) {
    this.registerBook.date = new Date(date);
  }

  search(book: Book) {
    if (
      String(book.isbn).includes(this.searchText) ||
      book.title.includes(this.searchText) ||
      book.actor.includes(this.searchText)) {
      return true;
    }
    return false;
  }
}
