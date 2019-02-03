import { Component, OnInit, Input } from '@angular/core';
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
      let target = event.target as HTMLElement;
      console.log(target);
      while (!target.tagName.includes('TR')) {
        target = target.parentElement;
      }
      target.querySelector('td').replaceWith(document.createElement('td'));
      target.remove();
      this.books.forEach((targetBook, targetIdx) => {
        if (targetBook === book) {
          this.books.splice(targetIdx, 1);
        }
      });
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

  save(book: Book) {
    this.books.forEach((targetBook, targetIdx) => {
      if (targetBook.isbn === book.isbn) {
        this.books.splice(targetIdx, 1, this.editingBook);
      }
    });
    this.editingBook = new Book();
  }

  doRegister() {
    this.books.push(this.registerBook);
    this.registerBook = new Book();
    // this.databaseService.setBooks(this.books);
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
