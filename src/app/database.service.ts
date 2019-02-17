import {Injectable} from '@angular/core';
import {DataBase, Book, BookDetail, Member, RentHistory} from './DataBase';
import {Observable, of} from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private dataBase = new DataBase();
  private socket;
  private onAppend = new Event('onAppend');
  private onDrop = new Event('onDrop');
  private onSet = new Event('onSet');

  constructor() {
    this.socket = io(`ws://${document.location.hostname}:8080`);
    this.socket.emit('get');
    this.socket.on('set', (message: DataBase) => {
      this.dateIsDate(message);
      this.first(message);
      dispatchEvent(this.onSet);
      console.log(this.dataBase);
    });
    this.socket.on('append', (message: DataBase) => {
      this.dateIsDate(message);
      this.append(message);
      dispatchEvent(this.onAppend);
      console.log(this.dataBase);
    });
    this.socket.on('drop', (message: DataBase) => {
      this.delMatch(message);
      dispatchEvent(this.onDrop);
      console.log(this.dataBase);
    });
    this.socket.on('update', (message: DataBase) => {
      this.dateIsDate(message);
      this.updateMatch(message);
      console.log(this.dataBase);
    });
  }

  dateIsDate(obj: object): void {
    Object.keys(obj).forEach((tablename) => {
      if (typeof obj[tablename] !== 'object') {
        return;
      }
      (obj[tablename] as Array<any>).forEach((row) => {
        Object.keys(row).forEach((key) => {
          if (/([Dd])ate/.test(key) && row[key]) {
            row[key] = new Date(row[key]);
          }
        });
      });
    });
  }

  first(appendDB: DataBase): void {
    Array.prototype.push.apply(this.dataBase.books, appendDB.books);
    Array.prototype.push.apply(this.dataBase.bookDetails, appendDB.bookDetails);
    Array.prototype.push.apply(this.dataBase.members, appendDB.members);
    Array.prototype.push.apply(this.dataBase.histories, appendDB.histories);
  }

  append(appendDB: DataBase): void {
    Array.prototype.push.apply(this.dataBase.books, appendDB.books);
    Array.prototype.push.apply(this.dataBase.members, appendDB.members);
    Array.prototype.push.apply(this.dataBase.bookDetails, appendDB.bookDetails);
  }

  addEventListener(type: string, listener: EventListener | EventListenerObject, options?: boolean | AddEventListenerOptions) {
    addEventListener(type, listener, options);
  }

  addBook(book: Book): boolean {
    if (!this.dataBase.getBookByISBN(book.isbn)) {
      // this.dataBase.addBook(book);
      const request = new DataBase();
      request.addBook(book);
      console.log(request);
      this.socket.emit('append', request);
      return true;
    }
    return false;
  }

  addMember(member: Member): void {
    // this.dataBase.generateMemberId(member);
    // this.dataBase.addMember(member);
    const request = new DataBase();
    this.dataBase.generateMemberId(member);
    request.addMember(member);
    this.socket.emit('append', request);
  }

  addBookDetail(bookDetail: BookDetail): Promise<null> {
    return new Promise((resolve, reject) => {
      // this.dataBase.addBookDetail(bookDetail);
      const request = new DataBase();
      request.addBookDetail(bookDetail);
      addEventListener('onAppend', () => {
        resolve();
      }, {once: true});
      console.log(request);
      this.socket.emit('append', request);
    });
  }

  memberUpdateApply(member: Member): void {
    this.dataBase.members.forEach((targetMember, targetIdx) => {
      if (targetMember.id === member.id) {
        targetMember.email = member.email;
        targetMember.name = member.name;
        targetMember.address = member.address;
        targetMember.tel = member.tel;
      }
    });
  }

  bookUpdateApply(book: Book) {
    this.dataBase.books.forEach((targetBook, targetIdx) => {
      if (targetBook.isbn === book.isbn) {
        targetBook.title = book.title;
        targetBook.date = book.date;
        targetBook.actor = book.actor;
      }
    });
  }

  bookDetailUpdateApply(bookDetail: BookDetail) {
    this.dataBase.bookDetails.forEach((targetBookDetail, targetIdx) => {
      if (targetBookDetail.isbn === bookDetail.isbn && targetBookDetail.serial === bookDetail.serial) {
        targetBookDetail.status = bookDetail.status;
        targetBookDetail.rentalDate = bookDetail.rentalDate;
        targetBookDetail.returnDate = bookDetail.returnDate;
      }
    });
  }

  private updateMatch(updateDB: DataBase): void {
    updateDB.books.forEach((updateBook) => {
      this.bookUpdateApply(updateBook);
    });
    updateDB.bookDetails.forEach((updateBookDetail) => {
      this.bookDetailUpdateApply(updateBookDetail);
    });
    updateDB.members.forEach((updateMember) => {
      this.memberUpdateApply(updateMember);
    });
    updateDB.histories.forEach((history) => {
      this.dataBase.histories.push(history);
    });
  }

  bookEditApply(editingBook: Book) {
    const request = new DataBase();
    request.addBook(editingBook);
    this.socket.emit('update', request);
  }

  memberEditApply(editingMember: Member) {
    const request = new DataBase();
    request.addMember(editingMember);
    this.socket.emit('update', request);
  }

  delMatch(deleteDB: DataBase): void {
    deleteDB.books.forEach((delBook) => {
      this.dataBase.books.forEach((targetBook, targetIdx) => {
        if (targetBook.isbn === delBook.isbn) {
          this.dataBase.books.splice(targetIdx, 1);
        }
      });
    });
    deleteDB.bookDetails.forEach((delBookDetail) => {
      this.dataBase.bookDetails.forEach((targetBookDetail, targetIdx) => {
        if (targetBookDetail.isbn === delBookDetail.isbn && targetBookDetail.serial === delBookDetail.serial) {
          this.dataBase.bookDetails.splice(targetIdx, 1);
        }
      });
    });
    deleteDB.members.forEach((delMember) => {
      this.dataBase.members.forEach((targetMember, targetIdx) => {
        if (targetMember.id === delMember.id) {
          this.dataBase.members.splice(targetIdx, 1);
        }
      });
    });
  }

  deleteMember(member: Member): void {
    const request = new DataBase();
    request.addMember(member);
    this.socket.emit('drop', request);
  }

  deleteBook(book: Book): void {
    this.getBookDetailsByIsbn(book.isbn).then((bookDetails: Array<BookDetail>) => {
      const request = new DataBase();
      for (const bookDetail of bookDetails) {
        request.addBookDetail(bookDetail);
        request.addBook(book);
        this.socket.emit('drop', request);
      }
    });
  }

  deleteBookDetail(bookDetail: BookDetail): void {
    const request = new DataBase();
    request.addBookDetail(bookDetail);
    this.socket.emit('drop', request);
  }

  getBookDetailsByIsbn(isbn: number) {
    const get = () => {
      const result = new Array<BookDetail>();
      this.dataBase.bookDetails.forEach((bookDetail) => {
        if (bookDetail.isbn === isbn) {
          result.push(bookDetail);
        }
      });
      return result;
    };
    return new Promise((resolve, reject) => {
      if (this.dataBase.bookDetails[0]) {
        resolve(get());
      } else {
        addEventListener('onSet', () => {
          resolve(get());
        }, {once: true});
      }
    });
  }

  getMemberById(id: number): Promise<Member> {
    return new Promise((resolve, reject) => {
      if (this.dataBase.members[0]) {
        resolve(this.dataBase.getMemberById(id));
      } else {
        addEventListener('onSet', () => {
          resolve(this.getMemberById(id));
        }, {once: true});
      }
    });
  }

  setRental(isbn: number, serial: number, id: number, returnDate: Date): Promise<null> {
    // this.dataBase.setRental(isbn, serial, id, returnDate);
    return new Promise((resolve, reject) => {
      const request = new DataBase();
      request.addBookDetail(this.dataBase.getBookDetailByISBNSerial(isbn, serial));
      request.setRental(isbn, serial, id, returnDate);
      this.socket.emit('update', request);
      console.log(request);
      addEventListener('update', () => {
        resolve();
      }, {once: true});
      addEventListener('err', () => {
        reject();
      }, {once: true});
    });
  }

  setReturn(isbn: number, serial: number, id: number): Promise<null> {
    // return this.dataBase.setReturn(isbn, serial, id);
    return new Promise((resolve, reject) => {
      const request = new DataBase();
      request.addBookDetail(this.dataBase.getBookDetailByISBNSerial(isbn, serial));
      request.setReturn(isbn, serial, id);
      this.socket.emit('update', request);
      addEventListener('update', () => {
        resolve();
      }, {once: true});
      addEventListener('err', () => {
        reject();
      }, {once: true});
    });
  }

  getBooks(): Observable<Book[]> {
    if (this.dataBase.books[0]) {
      dispatchEvent(this.onSet);
    }
    return of(this.dataBase.books);
  }

  getMembers(): Observable<Member[]> {
    return of(this.dataBase.members);
  }

  getBookDetails(): Observable<BookDetail[]> {
    return of(this.dataBase.bookDetails);
  }

  getBookDetailsByState(state: number): Promise<Array<BookDetail>> {
    return new Promise((resolve, reject) => {
      if (this.dataBase.bookDetails[0]) {
        resolve(this.dataBase.getBookDetailsByState(state));
      } else {
        addEventListener('onSet', () => {
          resolve(this.dataBase.getBookDetailsByState(state));
        }, {once: true});
      }
    });
  }

  getHistories(): Observable<RentHistory[]> {
    return of(this.dataBase.histories);
  }

  getBookByIsbn(isbn: number) {
    return this.dataBase.getBookByISBN(isbn);
  }
}
