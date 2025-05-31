import { LoginUserDto } from 'src/modules/auth/dto/login-user.dto';

export const stubLoginUserDto = (): LoginUserDto => {
  return {
    email: 'email@keeplet.com',
    password: 'StrongPassword1',
  };
};
