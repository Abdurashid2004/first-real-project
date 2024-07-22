import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from "@nestjs/common";

export const CookieGetter = createParamDecorator(
  async (data: string, context: ExecutionContext): Promise<string> => {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException("Token is not founds");
    }
    return refreshToken;
  }
);
