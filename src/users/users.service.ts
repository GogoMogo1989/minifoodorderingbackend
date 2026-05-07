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

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async createCustomer(input: CreateUserInput) {
    const existingUser = await this.findByEmail(input.email);

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

  async findByEmail(email: string) {
    return this.userModel.findOne({
      email: email.toLowerCase(),
    });
  }

  toSafeUser(user: UserDocument) {
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
    };
  }

}