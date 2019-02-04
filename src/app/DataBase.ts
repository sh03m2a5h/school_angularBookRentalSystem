import {Data} from '@angular/router';

export class Book {
    public isbn: number;
    public title: string;
    public actor: string;
    public date: Date;
    constructor() {
      this.isbn = null;
      this.title = null;
      this.actor = null;
      this.date = null;
    }
}
export class Member {
    public name: string;
    public address: string;
    public tel: string;
    public email: string;
    public id: number;
    constructor() {
      this.name = null;
      this.address = null;
      this.tel = null;
      this.email = null;
      this.id = null;
    }
}
export class BookDetail {
    public isbn: number;
    public serial: number;
    public status: number;
    public date: Date;
    constructor() {
      this.isbn = null;
      this.serial = null;
      this.status = null;
      this.date = null;
    }
}
export class History {
  private id: number;
  private isbn: number;
  private type: string;
  private date: Date;
  constructor(id: number, isbn: number, type: string, date: Date) {
    this.id = id;
    this.isbn = isbn;
    this.type = type;
    this.date = date;
  }
}

export class DataBase {
    public persons: Array<Member> = new Array<Member>();
    public books: Array<Book> = new Array<Book>();
    public bookDetails: Array<BookDetail> = new Array<BookDetail>();
    public histories: Array<History> = new Array<History>();

    constructor() {
        this.persons.push(new Member());
        this.books.push(new Book());
        this.bookDetails.push(new BookDetail());
    }

    addBook(book: Book): boolean {
        if (this.getBookByISBN(book.isbn)) {
            return false;
        } else {
            this.books.push(book);
            return true;
        }
    }

    addMember(member: Member): boolean {
        if (this.getMemberById(member.id)) {
            return false;
        } else {
            this.persons.push(member);
            return true;
        }
    }

    generateMemberId(member: Member): void {
      let idBuff: number;
      do {
        idBuff = Math.floor(Math.random() * 90000) + 10000;
      } while (this.getMemberById(idBuff));
      member.id = idBuff;
    }

    getMemberById(id: number): Member {
        let result: Member = null;
        this.persons.forEach((member) => {
            if (member.id === id) {
                result = member;
            }
        });
        return result;
    }

    getBookByISBN(isbn: number): Book {
        let result: Book = null;
        this.books.forEach((book) => {
            if (book.isbn === isbn) {
                result = book;
            }
        });
        return result;
    }

    getBookDetailByISBNSerial(isbn: number, serial: number): BookDetail {
        let result: BookDetail = null;
        this.bookDetails.forEach((bookDetail) => {
            if (bookDetail.isbn === isbn && bookDetail.serial === serial) {
                result = bookDetail;
            }
        });
        return result;
    }

    setRental(isbn: number, serial: number, id: number): boolean {
      const bookDetail = this.getBookDetailByISBNSerial(isbn, serial);
      if (!bookDetail || bookDetail.status) {
        return false;
      } else {
        bookDetail.status = id;
        const now = new Date(Date.now());
        bookDetail.date = now;
        this.histories.push(new History(id, isbn, 'rental', now));
      }
    }

    setReturn(isbn: number, serial: number, id: number): boolean {
      const bookDetail = this.getBookDetailByISBNSerial(isbn, serial);
      if (!bookDetail || !bookDetail.status) {
        return false;
      } else {
        bookDetail.status = null;
        bookDetail.date = null;
        this.histories.push(new History(id, isbn, 'return', new Date(Date.now())));
      }
    }

    parse(json: object): void {
      const DB = json as DataBase;
      Object.keys(DB).forEach(k => {
        DB[k].forEach(table => {
          Object.keys(table).forEach(key => {
            if (key === 'date') {
              table.date = new Date(table.date);
              if (table.date.toString() === 'Invalid Date') {
                table.date = null;
              }
            }
          });
        });
        console.log(DB[k]);
        this[k] = DB[k];
      });
      console.log(this);
      return;
    }
}
