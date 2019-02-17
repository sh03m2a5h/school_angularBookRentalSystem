import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BooksComponent} from './books/books.component';
import {MemberComponent} from './members/member.component';
import {HistoryComponent} from './history/history.component';
import {RentalComponent} from './rental/rental.component';
import {MemberRegisterComponent} from './member-register/member-register.component';
import {MemberDetailComponent} from './member-detail/member-detail.component';
import {MemberEditComponent} from './member-edit/member-edit.component';

const routes: Routes = [
  {path: '', redirectTo: '/books', pathMatch: 'full'},
  {path: 'books', component: BooksComponent},
  {path: 'books/:isbn', component: BooksComponent},
  {path: 'members', component: MemberComponent, children: [
      {path: 'register', component: MemberRegisterComponent},
      {path: ':id/edit', component: MemberEditComponent},
      {path: ':id', component: MemberDetailComponent}
    ]},
  {path: 'history', component: HistoryComponent},
  {path: 'rental', component: RentalComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
