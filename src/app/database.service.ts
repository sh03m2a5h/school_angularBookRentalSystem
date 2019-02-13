import { Injectable } from '@angular/core';
import { DataBase, Book, BookDetail, Member, RentHistory } from './DataBase';
import { Observable, of } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private dataBase = new DataBase();
  private socket;
  private onAppend = new Event('onAppend');

  constructor() {
    this.socket = io(`ws://${document.location.hostname}:8080`);
    this.socket.emit('get');
    this.socket.on('set', (message: DataBase) => {
      this.dateIsDate(message);
      this.dataBase.append(message);
      console.log(this.dataBase);
    });
    this.socket.on('append', (message: DataBase) => {
      this.dateIsDate(message);
      this.dataBase.append(message);
      dispatchEvent(this.onAppend);
      console.log(this.dataBase);
    });
  }

  dateIsDate(obj: object): void {
    Object.keys(obj).forEach((tablename) => {
      if (typeof obj[tablename] !== 'object') { return; }
      (obj[tablename] as Array<any>).forEach((row) => {
        Object.keys(row).forEach((key) => {
          if (/([Dd])ate/.test(key) && row[key]) {
            row[key] = new Date(row[key]);
          }
        });
      });
    });
  }

  addBook(book: Book): boolean {
    if (!this.dataBase.getBookByISBN(book.isbn)) {
      // this.dataBase.addBook(book);
      const request = new DataBase();
      request.addBook(book);
      this.socket.emit('append', request);
      return true;
    }
    return false;
  }

  memberEditApply(member: Member): void {
    this.dataBase.members.forEach((targetPerson, targetIdx) => {
      if (targetPerson.id === member.id) {
        this.dataBase.members.splice(targetIdx, 1, member);
      }
    });
  }

  addMember(member: Member): void {
    // this.dataBase.generateMemberId(member);
    this.dataBase.addMember(member);
    const request = new DataBase();
    request.addMember(member);
    this.socket.emit('append', request);
  }

  addBookDetail(bookDetail: BookDetail): Promise<null> {
    return new Promise((resolve, reject) => {
      this.dataBase.addBookDetail(bookDetail);
      const request = new DataBase();
      request.addBookDetail(bookDetail);
      addEventListener('onAppend', () => {
        resolve();
      }, {once: true});
      this.socket.emit('append', request);
    });
  }

  deleteMember(member: Member): void {
    this.dataBase.members.forEach((targetPerson, targetIdx) => {
      if (targetPerson === member) {
        this.dataBase.members.splice(targetIdx, 1);
      }
    });
  }

  deleteBook(book: Book): void {
    this.dataBase.books.forEach((targetBook, targetIdx) => {
      if (targetBook === book) {
        this.dataBase.books.splice(targetIdx, 1);
      }
    });
  }

  deleteBookDetail(bookDetail: BookDetail): void {
    this.dataBase.bookDetails.forEach((targetBookDetail, targetIdx) => {
      if (targetBookDetail.isbn === bookDetail.isbn && targetBookDetail.serial === bookDetail.serial) {
        this.dataBase.bookDetails.splice(targetIdx, 1);
      }
    });
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
