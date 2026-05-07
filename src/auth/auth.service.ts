import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerDto: RegisterDto) {
    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    return this.usersService.createCustomer({
      name: registerDto.name,
      email: registerDto.email,
      passwordHash,
    });
  }
}