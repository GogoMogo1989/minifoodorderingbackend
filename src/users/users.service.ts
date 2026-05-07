import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createCustomer(input: CreateUserInput) {
    const existingUser = await this.userModel.findOne({
      email: input.email.toLowerCase(),
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const user = await this.userModel.create({
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
    });

    return this.toSafeUser(user);
  }

  private toSafeUser(user: UserDocument) {
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
    };
  }
}