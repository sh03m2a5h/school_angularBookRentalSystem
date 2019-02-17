import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../database.service';
import { Member} from '../DataBase';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
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
    this.databaseService.getMembers().subscribe(members => this.members = members);
  }

  edit(member: Member) {
    if (this.editingMember.id && !confirm('編集中のデータは削除されます。よろしいですか？')) {
      return;
    }
    this.editingMember.id = member.id;
    this.editingMember.name = member.name;
    this.editingMember.tel = member.tel;
    this.editingMember.address = member.address;
    this.editingMember.email = member.email;
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
