import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

/**
 * Payload structure for JWT tokens
 */
export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'lunaria-secret-key',
    });
    this.logger.log('JWT Strategy initialized');
  }

  /**
   * Validates the JWT payload and returns the user
   * @param payload - The decoded JWT payload
   * @returns The complete user entity
   */
  async validate(payload: JwtPayload) {
    this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);

    try {
      const user = await this.usersService.findOneById(payload.sub);

      if (!user) {
        this.logger.warn(`User not found for sub: ${payload.sub}`);
        throw new UnauthorizedException('Invalid token');
      }

      this.logger.debug(`User found: ${user.email}`);
      // Return the complete user entity for controllers
      return user;
    } catch (error) {
      this.logger.error(`JWT validation error: ${error.message}`, error.stack);
      throw error;
    }
  }
}
