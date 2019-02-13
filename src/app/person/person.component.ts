import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../database.service';
import { Member} from '../DataBase';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  members: Member[];
  editingMember: Member;
  registerMember: Member;
  registerForm: boolean;

  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
    this.getMember();
    this.editingMember = new Member();
  }

  getMember(): void {
    this.databaseService.getMembers().subscribe(persons => this.members = persons);
  }

  edit(person: Member) {
    if (this.editingMember.id && !confirm('編集中のデータは削除されます。よろしいですか？')) {
      return;
    }
    this.editingMember.id = person.id;
    this.editingMember.name = person.name;
    this.editingMember.tel = person.tel;
    this.editingMember.address = person.address;
    this.editingMember.email = person.email;
  }

  save(): void {
    this.databaseService.memberEditApply(this.editingMember);
    this.editingMember = new Member();
  }

  delete(members: Member) {
    if (confirm('本当に削除しますか？')) {
      this.databaseService.deleteMember(members);
    }
  }

  showRegister() {
    this.registerForm = !this.registerForm;
    this.registerMember = new Member();
  }

  doRegister() {
    this.databaseService.addMember(this.registerMember);
    this.registerMember = new Member();
  }
}
