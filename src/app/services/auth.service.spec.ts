import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerMock: Router;

  beforeEach(() => {
    routerMock = { navigate: jasmine.createSpy('navigate') } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerMock },
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize user$ with the stored user', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ id: 1, name: 'Test User', email: 'test@example.com', password: 'password' }));
    service = TestBed.inject(AuthService); // Re-initializa para que use el mock
    expect(service.user$()).toEqual({ id: '1', name: 'Test User', email: 'test@example.com', password: 'password' });
  });

  it('should register a user', () => {
    const user: User = { id: '1', name: 'Test User', email: 'test@example.com', password: 'password' };
    service.register(user).subscribe((res) => {
      expect(res).toEqual(user);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('POST');
    req.flush(user);
  });

  it('should login a user', () => {
    const user: User = { id: '1', name: 'Test User', email: 'test@example.com', password: 'password' };
    spyOn(localStorage, 'setItem');
    service.login('test@example.com', 'password').subscribe((res) => {
      expect(res).toEqual(user);
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(user));
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users?email=test@example.com&password=password`);
    expect(req.request.method).toBe('GET');
    req.flush([user]);
  });

  it('should handle logout', () => {
    spyOn(localStorage, 'removeItem');
    service.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});

