import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password',
  };

  const localStorageMock = {
    getItem: jasmine.createSpy('getItem').and.callFake((key: string) =>
      key === 'user' ? JSON.stringify(mockUser) : null
    ),
    setItem: jasmine.createSpy('setItem'),
    removeItem: jasmine.createSpy('removeItem'),
  };

  beforeEach(() => {
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake(localStorageMock.getItem);
    spyOn(localStorage, 'setItem').and.callFake(localStorageMock.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(localStorageMock.removeItem);

    // Mock Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should initialize user$ with the stored user', () => {
    expect(service.user$()).toEqual(mockUser); // Check if user$ signal is correctly initialized
  });

  it('should log in and set user$', () => {
    service.login(mockUser.email, mockUser.password).subscribe((user) => {
      expect(user).toEqual(mockUser);
      expect(service.user$()).toEqual(mockUser);
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}?email=${mockUser.email}&password=${mockUser.password}`
    );
    expect(req.request.method).toBe('GET');
    req.flush([mockUser]); // Simulate API response
  });

  it('should log out and clear user$', () => {
    service.logout();
    expect(service.user$()).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should register a new user', () => {
    const newUser: User = {
      id: '2',
      name: 'New User',
      email: 'new@example.com',
      password: 'newpassword',
    };

    service.register(newUser).subscribe((user) => {
      expect(user).toEqual(newUser);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(newUser); // Simulate API response
  });
});
