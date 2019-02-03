import {Component, Input, OnInit} from '@angular/core';
import {Book, BookDetail} from '../DataBase';
import {DatabaseService} from '../database.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  private selectedBook: Book;
  registerBookDetail: BookDetail;
  @Input('selectedBook')
  set updateSelectedBook(Value: Book) {
    this.selectedBook = Value;
    this.getBookDetails();
  }
  bookDetails: BookDetail[];
  selectedBookDetail: BookDetail[];
  registerForm: boolean;

  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
    this.getBookDetails();
  }

  getBookDetails() {
    this.databaseService.getBookDetails().subscribe(bookDetails => this.bookDetails = bookDetails);
    this.selectedBookDetail = new Array<BookDetail>();
    for (const bookDetail of this.bookDetails) {
      if (bookDetail.isbn === this.selectedBook.isbn) {
        this.selectedBookDetail.push(bookDetail);
      }
    }
  }

  showRegister() {
    this.registerForm = !this.registerForm;
    this.registerBookDetail = new BookDetail();
    this.registerBookDetail.isbn = this.selectedBook.isbn;
  }

  doRegister() {
    this.bookDetails.push(this.registerBookDetail);
    this.selectedBookDetail.push(this.registerBookDetail);
    this.registerBookDetail = new BookDetail();
  }
}
