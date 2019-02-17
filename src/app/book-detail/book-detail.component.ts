import {Component, OnInit} from '@angular/core';
import {Book, BookDetail} from '../DataBase';
import {DatabaseService} from '../database.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  selectedIsbn: number;
  registerBookDetail: BookDetail;
  selectedBookDetail: BookDetail[];
  registerForm: boolean;

  constructor(private databaseService: DatabaseService, private  route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log(params);
      if (params.isbn) {
        this.selectedIsbn = +params.isbn;
        this.getBookDetails();
        this.databaseService.addEventListener('onAppend', () => {this.getBookDetails(); });
        this.databaseService.addEventListener('onDrop', () => {this.getBookDetails(); });
      }
    });
    console.log('bookChanged');
  }

  getTitle() {
    const book = this.databaseService.getBookByIsbn(this.selectedIsbn);
    if (book) {
      return book.title;
    } else {
      return '';
    }
  }

  getBookDetails() {
    this.databaseService.getBookDetailsByIsbn(this.selectedIsbn).then((bookDetail: Array<BookDetail>) => {
      this.selectedBookDetail = bookDetail;
    });
  }

  showRegister() {
    this.registerForm = !this.registerForm;
    this.registerBookDetail = new BookDetail();
    this.registerBookDetail.isbn = this.selectedIsbn;
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
