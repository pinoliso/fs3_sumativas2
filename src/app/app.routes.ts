import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ViewBooksComponent } from "./books/view-books/view-books.component";
import { BookFormComponent } from './books/book-form/book-form.component';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'products', component: ViewBooksComponent, canActivate: [AuthGuard] },
  { path: 'products/new', component: BookFormComponent, canActivate: [AuthGuard] },
  { path: 'products/edit/:id', component: BookFormComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
];
