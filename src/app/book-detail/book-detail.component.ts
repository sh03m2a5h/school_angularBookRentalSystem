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
  }

  doRegister() {
    this.registerBookDetail.isbn = this.selectedBook.isbn;
    this.registerBookDetail.serial = Number(this.registerBookDetail.serial);
    this.bookDetails.push(this.registerBookDetail);
    this.selectedBookDetail.push(this.registerBookDetail);
    this.registerBookDetail = new BookDetail();
  }

  delete(bookDetail: BookDetail) {
    if (confirm('本当に削除しますか？')) {
      let target = event.target as HTMLElement;
      while (!target.tagName.includes('TR')) {
        target = target.parentElement;
      }
      target.querySelector('td').replaceWith(document.createElement('td'));
      target.remove();
      this.bookDetails.forEach((targetBookDetail, targetIdx) => {
        if (targetBookDetail === bookDetail) {
          this.bookDetails.splice(targetIdx, 1);
        }
      });
    }
  }
}
