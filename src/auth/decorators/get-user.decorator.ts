import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract the user from the request object
 * Works with JWT authentication strategy to get the currently authenticated user
 */
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
