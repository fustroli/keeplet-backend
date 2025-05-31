import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/modules/user/entities';
import { CreateSocialUserDto, UpdateUserDto } from 'src/modules/user/dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async deleteOne(id: number) {
    try {
      const user = await this.repository.findOne({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException('No user found with the provided id.');
      }

      await this.repository.softDelete(id);
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const currentUser = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!currentUser) {
      throw new NotFoundException('No user found with the provided id.');
    }

    Object.assign(currentUser, data);

    const savedUser = await this.repository.save(currentUser);

    return savedUser;
  }

  async findByEmail(email: string) {
    const user = this.repository.findOne({ where: { email } });
    if (!user) throw new NotFoundException();
    return user;
  }

  async findById(id: number) {
    const user = this.repository.findOne({ where: { id } });
    if (!user) throw new NotFoundException();
    return user;
  }

  async createUser(user: CreateSocialUserDto): Promise<User> {
    return this.repository.save(user);
  }
}
