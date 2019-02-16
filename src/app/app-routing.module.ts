import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BooksComponent} from './books/books.component';
import {PersonComponent} from './person/person.component';
import {HistoryComponent} from './history/history.component';
import {RentalComponent} from './rental/rental.component';

const routes: Routes = [
  {path: '', redirectTo: '/books', pathMatch: 'full'},
  {path: 'books', component: BooksComponent},
  {path: 'books/:isbn', component: BooksComponent},
  {path: 'members', component: PersonComponent},
  {path: 'history', component: HistoryComponent},
  {path: 'rental', component: RentalComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
