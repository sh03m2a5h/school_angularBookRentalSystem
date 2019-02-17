import { Component, OnInit } from '@angular/core';
import {Member} from '../DataBase';
import {DatabaseService} from '../database.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  editMember: Member;

  constructor(private databaseService: DatabaseService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log(params);
      if (params.id) {
        this.getMember(+params.id);
      }
    });
  }
  getMember(id: number) {
    this.databaseService.getMemberById(id).then((member) => {
      this.editMember = member;
    });
  }

  Save() {
    this.databaseService.memberEditApply(this.editMember);
  }
}
