import { User, stubUser } from 'src/modules/user/entities';

import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UserController } from 'src/modules/user/controller/user.controller';
import { UserService } from 'src/modules/user/service';
import { getRepositoryToken } from '@nestjs/typeorm';

const userStub = stubUser();

const repositoryMock = {
  findOne: jest.fn(),
  softDelete: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMock,
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true }) // Mock the ThrottlerGuard
      .compile();

    service = moduleRef.get<UserService>(UserService);
    controller = moduleRef.get<UserController>(UserController);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should return the current user', async () => {
      // getMe just returns the currentUser
      const result = await controller.getMe(userStub);
      expect(result).toEqual(userStub);
    });

    it('should throw NotFoundException if currentUser is not provided', async () => {
      await expect(controller.getMe(undefined as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateMe', () => {
    it('should update and return the user', async () => {
      const updateUserDto = { email: 'new@example.com' };
      const updatedUser: User = { ...userStub, ...updateUserDto };

      // Mock the service update method
      jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

      const result = await controller.updateMe(userStub, updateUserDto);
      expect(service.update).toHaveBeenCalledWith(userStub.id, updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw an error if user is not found', async () => {
      const updateUserDto = { email: 'new@example.com' };

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(
        controller.updateMe(userStub, updateUserDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle empty update request gracefully', async () => {
      const emptyDto = {};
      jest.spyOn(service, 'update').mockResolvedValue(userStub);

      const result = await controller.updateMe(userStub, emptyDto);
      expect(result).toEqual(userStub);
    });
  });

  describe('deleteMe', () => {
    it('should return 204 status code on success', async () => {
      jest.spyOn(service, 'deleteOne').mockResolvedValue(undefined);

      const response = await controller.deleteMe(userStub);
      expect(response).toBeUndefined(); // Implicitly checks 204
    });

    it('should call service.deleteOne and return undefined', async () => {
      jest.spyOn(service, 'deleteOne').mockResolvedValue(undefined);

      const result = await controller.deleteMe(userStub);
      expect(service.deleteOne).toHaveBeenCalledWith(userStub.id);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest
        .spyOn(service, 'deleteOne')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.deleteMe(userStub)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
