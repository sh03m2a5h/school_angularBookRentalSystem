import { Injectable, OnInit } from '@angular/core';
import { DataBase, Book, BookDetail, Member, RentHistory } from './DataBase';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService implements OnInit {
  private dataBase = new DataBase();

  constructor() {
    const request = new XMLHttpRequest();
    request.open('GET', 'https://script.google.com/macros/s/AKfycbwgv5NQ9D6OTQyqoZ8k7niQCqM9gZMvfcyb6xISpxMPb5gYL54T/exec', false);
    request.onreadystatechange = () => {
      const json = JSON.parse(request.responseText);
      this.dataBase.parse(json);
    };
    request.send();
    // setInterval(() => {
    //   console.log(this.dataBase);
    // }, 10000);
  }

  ngOnInit(): void {
  }

  addBook(book: Book): boolean {
    if (!this.dataBase.getBookByISBN(book.isbn)) {
      this.dataBase.books.push(book);
      return true;
    }
    return false;
  }

  addMember(member: Member): void {
    this.dataBase.generateMemberId(member);
    this.dataBase.persons.push(member);
  }

  setRental(isbn: number, serial: number, id: number): boolean {
    return this.dataBase.setRental(isbn, serial, id);
  }

  setReturn(isbn: number, serial: number, id: number): boolean {
    return this.dataBase.setReturn(isbn, serial, id);
  }

  getBooks(): Observable<Book[]> {
    return of(this.dataBase.books);
  }

  getMembers(): Observable<Member[]> {
    return of(this.dataBase.persons);
  }

  getBookDetails(): Observable<BookDetail[]> {
    return of(this.dataBase.bookDetails);
  }

  getHistories(): Observable<RentHistory[]> {
    // @ts-ignore
    return of(this.dataBase.histories);
  }
}
