import { User, stubUser } from 'src/modules/user/entities';

import { CreateUserDto } from 'src/modules/auth/dto';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { UserService } from 'src/modules/user/service/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';

const userStub = stubUser();

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(userStub),
            find: jest.fn().mockResolvedValue(userStub),
            softDelete: jest.fn(),
            save: jest.fn().mockResolvedValue(userStub),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
    repository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteOne', () => {
    it('should delete an existing user', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(userStub);
      jest.spyOn(repository, 'softDelete').mockResolvedValue(undefined as any);

      await service.deleteOne(userStub.id);

      expect(repository.softDelete).toHaveBeenCalledWith(userStub.id);
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteOne(userStub.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the user if found', async () => {
      const updateUserDto = { email: 'updated@example.com' };
      const updatedUser = { ...userStub, ...updateUserDto };
      jest.spyOn(repository, 'findOne').mockResolvedValue(userStub);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedUser);

      const result = await service.update(userStub.id, updateUserDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: userStub.id },
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...userStub,
        ...updateUserDto,
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.update(userStub.id, { email: 'fail@example.com' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should only update provided fields', async () => {
      const updateUserDto = { email: 'partial@example.com' };
      const updatedUser = { ...userStub, ...updateUserDto };
      jest.spyOn(repository, 'findOne').mockResolvedValue(userStub);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedUser);

      await service.update(userStub.id, updateUserDto);

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateUserDto),
      );
    });
  });
});
