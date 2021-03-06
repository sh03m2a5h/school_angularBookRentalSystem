import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BooksComponent } from './books/books.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { MemberComponent } from './members/member.component';
import { HistoryComponent } from './history/history.component';
import { RentalComponent } from './rental/rental.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { MemberDetailComponent } from './member-detail/member-detail.component';
import { MemberRegisterComponent } from './member-register/member-register.component';
import { MemberEditComponent } from './member-edit/member-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    BooksComponent,
    BookDetailComponent,
    MemberComponent,
    HistoryComponent,
    RentalComponent,
    MemberDetailComponent,
    MemberRegisterComponent,
    MemberEditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
