import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { ICurrentUser } from 'src/modules/auth/interfaces';

export const CurrentUser = createParamDecorator(
  (
    data: keyof ICurrentUser,
    context: ExecutionContext,
  ): string | number | ICurrentUser | null => {
    const request = context.switchToHttp().getRequest();
    const user: ICurrentUser = request.user;

    if (!user) return null;
    if (!data) return user;
    return user[data];
  },
);
