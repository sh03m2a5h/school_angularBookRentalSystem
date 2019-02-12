import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../database.service';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.css']
})
export class RentalComponent implements OnInit {
  memberId: string;
  bookIsbn: string;
  bookSerial: string;

  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
    this.memberId = '';
    this.bookIsbn = '';
    this.bookSerial = '';
  }


  rentals() {
    if (!this.databaseService.setRental(Number(this.bookIsbn), Number(this.bookSerial), Number(this.memberId), new Date())) {
      alert('レンタルに失敗しました。どれかが存在しないか借りられてます');
    }
  }

  returns() {
    if (!this.databaseService.setReturn(Number(this.bookIsbn), Number(this.bookSerial), Number(this.memberId))) {
      alert('返却に失敗しました。どれかが存在しないか実は借りてません');
    }
  }
}
