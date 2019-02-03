import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../database.service';
import {Book, Member} from '../DataBase';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  persons: Member[];
  editingPerson: Member;

  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
    this.getPersons();
  }

  getPersons(): void {
    this.databaseService.getPersons().subscribe( persons => this.persons = persons);
  }

  edit(person: Member) {
    if (this.editingPerson.id && !confirm('編集中のデータは削除されます。よろしいですか？')) {
      return;
    }
    this.editingPerson.id = person.id;
    this.editingPerson.name = person.name;
    this.editingPerson.tel = person.tel;
    this.editingPerson.address = person.address;
    this.editingPerson.email = person.email;
  }

  save(person: Member) {
    this.persons.forEach((targetPerson, targetIdx) => {
      if (targetPerson.id === person.id) {
        this.persons.splice(targetIdx, 1, this.editingPerson);
      }
    });
    this.editingPerson = new Member();
  }
}
