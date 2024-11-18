import { Component, effect } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isLoggedIn = false;
  username = '';

  environment = environment;

  constructor(public authService: AuthService, private router: Router) {
    effect(() => {
      const user = this.authService.user$();
      console.log(user)
      this.isLoggedIn = !!user;
      this.username = user?.name || '';
    });
  }

  ngOnInit(): void {

  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/auth/login']);
  }
}

