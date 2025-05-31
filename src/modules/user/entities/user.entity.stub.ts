import { User } from 'src/modules/user/entities/user.entity';

export function stubUser(override: Partial<User> = {}): User {
  return {
    id: 1,
    email: 'test@mail.com',
    hash: 'hashedPassword',
    refreshToken: null,
    googleId: '',
    createTimeStamp: new Date(),
    updateTimeStamp: new Date(),
    deleteTimeStamp: null,
    ...override,
  };
}
