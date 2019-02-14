import {Component, Input, OnInit} from '@angular/core';
import {Book, BookDetail} from '../DataBase';
import {DatabaseService} from '../database.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  selectedBook: Book;
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
    console.log('bookChanged');
  }

  getBookDetails() {
    this.databaseService.getBookDetails().subscribe(bookDetails => {
      this.bookDetails = bookDetails;
      this.selectedBookDetail = new Array<BookDetail>();
      for (const bookDetail of this.bookDetails) {
        if (bookDetail.isbn === this.selectedBook.isbn) {
          this.selectedBookDetail.push(bookDetail);
        }
      }
    });
  }

  showRegister() {
    this.registerForm = !this.registerForm;
    this.registerBookDetail = new BookDetail();
    this.registerBookDetail.isbn = this.selectedBook.isbn;
  }

  async doRegister() {
    await this.databaseService.addBookDetail(this.registerBookDetail);
    this.getBookDetails();
    this.registerBookDetail = new BookDetail();
  }

  delete(bookDetail: BookDetail) {
    if (confirm('本当に削除しますか？')) {
      this.databaseService.deleteBookDetail(bookDetail);
    }
  }
}
