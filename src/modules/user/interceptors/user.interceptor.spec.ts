import { CallHandler, ExecutionContext } from '@nestjs/common';
import { User, stubUser } from 'src/modules/user/entities';

import { UserInterceptor } from 'src/modules/user/interceptors/user.interceptor';
import { lastValueFrom } from 'rxjs';
import { of } from 'rxjs';

const userStub = stubUser();

describe('UserInterceptor', () => {
  let interceptor: UserInterceptor;

  beforeEach(() => {
    interceptor = new UserInterceptor();
  });

  // Helper to handle Observable/Promise return type
  async function getObservableResult(
    context: ExecutionContext,
    handler: CallHandler,
  ) {
    const result = interceptor.intercept(context, handler);
    return result instanceof Promise ? await result : result;
  }

  it('should transform the response into a User instance', async () => {
    const mockHandler: CallHandler = {
      handle: () => of(userStub),
    };

    const observable = await getObservableResult(
      {} as ExecutionContext,
      mockHandler,
    );
    const result = await lastValueFrom(observable);
    expect(result).toBeInstanceOf(User);
  });

  it('should exclude the `hash` field', async () => {
    const mockHandler: CallHandler = {
      handle: () => of({ ...userStub, hash: 'secret' }),
    };

    const observable = await getObservableResult(
      {} as ExecutionContext,
      mockHandler,
    );
    const result = await lastValueFrom(observable);
    expect((result as any).hash).toBeUndefined();
  });

  it('should retain non-sensitive fields', async () => {
    const mockHandler: CallHandler = {
      handle: () => of(userStub),
    };

    const observable = await getObservableResult(
      {} as ExecutionContext,
      mockHandler,
    );
    const result = await lastValueFrom(observable);
    expect(result.id).toEqual(userStub.id);
    expect(result.email).toEqual(userStub.email);
  });
});
