export class Book {
  public isbn: number;
  public title: string;
  public actor: string;
  public date: Date;
  public picture?: ImageBitmap;
  constructor(obj?: Book) {
    if (obj) {
      this.isbn = obj.isbn;
      this.title = obj.title;
      this.actor = obj.actor;
      this.date = obj.date;
    }
  }
}
export class Member {
  public id: number;
  public name: string;
  public address: string;
  public tel: string;
  public email: string;
  constructor(obj?: Member) {
    if (obj) {
      this.name = obj.name;
      this.address = obj.address;
      this.tel = obj.tel;
      this.email = obj.email;
      this.id = obj.id;
    }
  }
}
export class BookDetail {
  public isbn: number;
  public serial: number;
  public status?: number;
  public rentalDate?: Date;
  public returnDate?: Date;
  constructor(obj?: BookDetail) {
    if (obj) {
      this.isbn = obj.isbn;
      this.serial = obj.serial;
      if (obj.status) {
        this.status = obj.status;
        this.rentalDate = obj.rentalDate;
        this.returnDate = obj.returnDate;
      }
    }
  }
}
export class RentHistory {
  public id: number;
  public isbn: number;
  public serial: number;
  public type: string;
  public date: Date;
  constructor(obj?: RentHistory) {
    if (obj) {
      this.id = obj.id;
      this.isbn = obj.isbn;
      this.serial = obj.serial;
      this.type = obj.type;
      this.date = obj.date;
    }
  }
}

export class DataBase {
    public members: Array<Member> = new Array<Member>();
    public books: Array<Book> = new Array<Book>();
    public bookDetails: Array<BookDetail> = new Array<BookDetail>();
    public histories: Array<RentHistory> = new Array<RentHistory>();

    constructor() {
        // this.members.push(new Member());
        // this.books.push(new Book());
        // this.bookDetails.push(new BookDetail());
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
            this.members.push(member);
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
        this.members.forEach((member) => {
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

    setRental(isbn: number, serial: number, id: number, returnDate: Date): boolean {
      const bookDetail = this.getBookDetailByISBNSerial(isbn, serial);
      if (!bookDetail || bookDetail.status) {
        return false;
      } else {
        bookDetail.status = id;
        const now = new Date(Date.now());
        bookDetail.rentalDate = now;
        bookDetail.returnDate = returnDate;
        this.histories.push({
          id,
          isbn,
          serial,
          type: 'rental',
          date: now
        });
        // id, isbn, serial, 'rental', now
        return true;
      }
    }

    setReturn(isbn: number, serial: number, id: number): boolean {
      const bookDetail = this.getBookDetailByISBNSerial(isbn, serial);
      if (!bookDetail || !bookDetail.status) {
        return false;
      } else {
        bookDetail.status = null;
        bookDetail.rentalDate = null;
        bookDetail.returnDate = null;
        this.histories.push(new RentHistory({
          id,
          isbn,
          serial,
          type: 'return',
          date: new Date(Date.now())
        }));
        // id, isbn, serial, 'return', new Date(Date.now())
        return true;
      }
    }
}
export enum reqtype {
  get, set, update, delete, append
}
export class Message extends DataBase {
  public message: reqtype;
}
