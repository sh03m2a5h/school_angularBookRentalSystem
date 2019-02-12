import { Injectable } from '@angular/core';
import {DataBase, Book, BookDetail, Member, RentHistory, Message} from './DataBase';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private dataBase = new DataBase();
  private url = 'https://script.google.com/macros/s/AKfycbxJYmI_uTpQdiF7-zorxZW8PnNp_QEXyi5RhtUMy-pvhtSZynf-/exec';
  private socket: WebSocketSubject<Message>;

  constructor(private http: HttpClient) {
    this.socket = WebSocketSubject.create(`ws://${document.location.hostname}:8080`);

    this.socket.subscribe((message) => {
      console.log(message);
    });
    setInterval(() => {
      console.log(this.dataBase);
    }, 10000);
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

  setRental(isbn: number, serial: number, id: number, returnDate: Date): boolean {
    return this.dataBase.setRental(isbn, serial, id, returnDate);
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
    if (!this.dataBase.members[0]) {
      result = this.http.get<Member[]>(this.url + '?table=persons');
      result.subscribe(members => this.dataBase.members = members);
    } else {
      result = of(this.dataBase.members);
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
