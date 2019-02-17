import { Component, OnInit } from '@angular/core';
import {Member} from '../DataBase';
import {DatabaseService} from '../database.service';

@Component({
  selector: 'app-member-register',
  templateUrl: './member-register.component.html',
  styleUrls: ['./member-register.component.css']
})
export class MemberRegisterComponent implements OnInit {
  registerMember: Member = new Member();

  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
  }

  doRegister() {
    this.databaseService.addMember(this.registerMember);
    this.registerMember = new Member();
  }
}
