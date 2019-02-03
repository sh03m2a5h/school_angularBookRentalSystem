import { Injectable, OnInit } from '@angular/core';
import { DataBase, Book, BookDetail, Member } from './DataBase';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
      Object.keys(json).forEach(k => {
        json[k].forEach(table => {
          Object.keys(table).forEach(key => {
            if (key === 'date') {
              table.date = new Date(table.date);
            }
          });
        });
        console.log(json[k]);
        this.dataBase[k] = json[k];
      });
      console.log(this.dataBase);
      return;
    };
    request.send();
    setInterval(() => {
      console.log(this.dataBase);
    }, 10000);
  }

  ngOnInit(): void {
  }

  getBooks(): Observable<Book[]> {
    return of(this.dataBase.books);
  }

  setBooks(books: Book[]) {
    this.dataBase.books = books;
  }

  getPersons(): Observable<Member[]> {
    return of(this.dataBase.persons);
  }

  getBookDetails(): Observable<BookDetail[]> {
    return of(this.dataBase.bookDetails);
  }
}
