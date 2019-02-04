import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../database.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
    this.databaseService.getHistories().subscribe();
  }

}
