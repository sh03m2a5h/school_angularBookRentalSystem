import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../database.service';
import {Member} from '../DataBase';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  persons: Member[];

  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
    this.getPersons();
  }

  getPersons(): void {
    this.databaseService.getPersons().subscribe( persons => this.persons = persons);
  }
}
