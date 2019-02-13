import { Injectable } from '@angular/core';
import {DataBase, Book, BookDetail, Member, RentHistory, Message, reqtype} from './DataBase';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private dataBase = new DataBase();
  private socket;

  constructor(private http: HttpClient) {
    this.socket = io(`ws://${document.location.hostname}:8080`);
    this.socket.emit('get');
    this.socket.on('set', (message: Message) => {
      Object.keys(message).forEach((tablename) => {
        if (typeof message[tablename] !== 'object') { return; }
        (message[tablename] as Array<any>).forEach((row) => {
          Object.keys(row).forEach((key) => {
            if (/(D|d)ate/.test(key) && row[key]) {
              row[key] = new Date(row[key]);
            }
          });
        });
      });
      this.dataBase = message;
      console.log(this.dataBase);
    });
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
    return of(this.dataBase.books);
  }

  getMembers(): Observable<Member[]> {
    return of(this.dataBase.members);
  }

  getBookDetails(): Observable<BookDetail[]> {
    return of(this.dataBase.bookDetails);
  }

  getHistories(): Observable<RentHistory[]> {
    return of(this.dataBase.histories);
  }
}
