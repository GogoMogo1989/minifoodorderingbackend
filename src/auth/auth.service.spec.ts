import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

type MockUsersService = {
  createCustomer: jest.Mock;
  findByEmail: jest.Mock;
  toSafeUser: jest.Mock;
};

type MockJwtService = {
  signAsync: jest.Mock;
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: MockUsersService;
  let jwtService: MockJwtService;

  const mockUser = {
    _id: '69fc996b0154f8c0762a962c',
    name: 'Test',
    email: 'test@test.com',
    passwordHash:
      '$2b$10$XaPQuliGaf9p4NBXflFsPutLwRhLTA5s0cH8XFATgoT3GdOq5l6zG',
    createdAt: new Date('2026-05-07T13:53:47.461Z'),
    updatedAt: new Date('2026-05-07T13:53:47.461Z'),
    __v: 0,
  };

  const safeUser = {
    id: '69fc996b0154f8c0762a962c',
    name: 'Test',
    email: 'test@test.com',
  };

  beforeEach(() => {
    usersService = {
      createCustomer: jest.fn(),
      findByEmail: jest.fn(),
      toSafeUser: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    authService = new AuthService(
      usersService as unknown as UsersService,
      jwtService as unknown as JwtService,
    );
  });

  it('should return access token and user on successful login', async () => {
    usersService.findByEmail.mockResolvedValue(mockUser);
    usersService.toSafeUser.mockReturnValue(safeUser);
    jwtService.signAsync.mockResolvedValue('jwt-token');

    const result = await authService.login({
      email: 'test@test.com',
      password: 'password123',
    });

    expect(result).toEqual({
      accessToken: 'jwt-token',
      user: safeUser,
    });

    expect(usersService.findByEmail).toHaveBeenCalledWith('test@test.com');
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: '69fc996b0154f8c0762a962c',
      email: 'test@test.com',
    });
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    usersService.findByEmail.mockResolvedValue(mockUser);

    await expect(
      authService.login({
        email: 'test@test.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});