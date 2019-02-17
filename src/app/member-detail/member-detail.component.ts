import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../database.service';
import {ActivatedRoute} from '@angular/router';
import {Book, BookDetail, Member, BookView} from '../DataBase';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  selectedId: number;
  member: Member;
  rentBooks: Array<BookView> = new Array<BookView>();

  constructor(private databaseService: DatabaseService, private  route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log(params);
      if (params.id) {
        this.selectedId = +params.id;
        this.getMember();
        this.getRentBook();
      }
    });
  }

  getMember() {
    this.databaseService.getMemberById(this.selectedId).then((member) => {
      this.member = member;
    });
  }

  getRentBook() {
    this.databaseService.getBookDetailsByState(this.selectedId).then((bookDetails) => {
      if (bookDetails[0]) {
        for (const bookDetailing of bookDetails) {
          this.rentBooks.push({
              book: this.databaseService.getBookByIsbn(bookDetailing.isbn),
              bookDetail: bookDetailing
            }
          );
        }
      }
    });
  }

  setReturn(book: BookView) {
    this.databaseService.setReturn(book.book.isbn, book.bookDetail.serial, this.member.id).then(() => {
      this.getRentBook();
    });
  }
}
