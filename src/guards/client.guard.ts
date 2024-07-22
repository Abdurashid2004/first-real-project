import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class ClientGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized patient 0');
    }

    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Unauthorized patient 1');
    }

    async function verify(token: string, jwtService: JwtService) {
      let patient: any;
      try {
        patient = await jwtService.verify(token, {
          secret: process.env.ACCESS_TOKEN_KEY_CLIENT,
        });
      } catch (error) {
        throw new BadRequestException(error.message);
      }

      if (!patient) {
        throw new UnauthorizedException('Unauthorized patient 2');
      }

      if (!patient.is_active) {
        throw new UnauthorizedException('Unauthorized patient 3');
      }

      req.patient = patient;
      return true;
    }

    return verify(token, this.jwtService);
  }
}
