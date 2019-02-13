import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../database.service';
import { RentHistory } from '../DataBase';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  histories: RentHistory[];

  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
    this.getHistories();
  }

  getHistories(): void {
    this.databaseService.getHistories().subscribe(histories => this.histories = histories);
  }

}
