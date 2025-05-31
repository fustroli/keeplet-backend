import { CreateUserDto } from 'src/modules/auth/dto/create-user.dto';
import { stubLoginUserDto } from 'src/modules/auth/dto/login-user.dto.stub';

export const stubCreateUserDto = (): CreateUserDto => {
  return {
    ...stubLoginUserDto(),
    confirmPassword: 'StrongPassword1',
  };
};
