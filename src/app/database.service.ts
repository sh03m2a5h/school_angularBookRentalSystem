import { Injectable, OnInit } from '@angular/core';
import { DataBase, Book, BookDetail, Member, RentHistory } from './DataBase';
import { Observable, of } from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService implements OnInit {
  private dataBase = new DataBase();
  private url = 'https://script.google.com/macros/s/AKfycbxJYmI_uTpQdiF7-zorxZW8PnNp_QEXyi5RhtUMy-pvhtSZynf-/exec';

  constructor(private http: HttpClient) {
    setInterval(() => {
      console.log(this.dataBase);
    }, 10000);
  }

  ngOnInit(): void {
  }

  addBook(book: Book): boolean {
    if (!this.dataBase.getBookByISBN(book.isbn)) {
      this.dataBase.addBook(book);
      return true;
    }
    return false;
  }

  addMember(member: Member): void {
    this.dataBase.generateMemberId(member);
    this.dataBase.addMember(member);
  }

  setRental(isbn: number, serial: number, id: number): boolean {
    return this.dataBase.setRental(isbn, serial, id);
  }

  setReturn(isbn: number, serial: number, id: number): boolean {
    return this.dataBase.setReturn(isbn, serial, id);
  }

  getBooks(): Observable<Book[]> {
    let result: Observable<Book[]>;
    if (!this.dataBase.books[0]) {
      result = this.http.get<Book[]>(this.url + '?table=books');
      result.subscribe(books => this.dataBase.books = books);
    } else {
      result = of(this.dataBase.books);
    }
    return result;
  }

  getMembers(): Observable<Member[]> {
    let result: Observable<Member[]>;
    if (!this.dataBase.persons[0]) {
      result = this.http.get<Member[]>(this.url + '?table=persons');
      result.subscribe(persons => this.dataBase.persons = persons);
    } else {
      result = of(this.dataBase.persons);
    }
    return result;
  }

  getBookDetails(): Observable<BookDetail[]> {
    let result: Observable<BookDetail[]>;
    if (!this.dataBase.bookDetails[0]) {
      result = this.http.get<BookDetail[]>(this.url + '?table=bookDetails');
      result.subscribe(bookDetails => this.dataBase.bookDetails = bookDetails);
    } else {
      result = of(this.dataBase.bookDetails);
    }
    return result;
  }

  getHistories(): Observable<RentHistory[]> {
    let result: Observable<RentHistory[]>;
    if (!this.dataBase.histories[0]) {
      result = this.http.get<RentHistory[]>(this.url + '?table=histories');
      result.subscribe(histories => this.dataBase.histories = histories);
    } else {
      result = of(this.dataBase.histories);
    }
    return result;
  }
}
